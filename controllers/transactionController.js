const supabase = require('../supabaseClient');

// Add transaction
const addTransaction = async (req, res) => {
  try {
    let { member_id, name, points_updated, description, type, updated_by, status } = req.body;

    type = type || 'credit';

    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('points')
      .eq('member_id', member_id)
      .single();

    if (memberError) throw memberError;

    const pointsChange = parseInt(points_updated, 10);
    let newPoints = memberData.points;

    if (type === 'credit') {
      newPoints += pointsChange;
    } else if (type === 'debit') {
      newPoints -= pointsChange;
    }

    if (newPoints < 0) {
      return res.status(400).json({ status: 'error', message: 'Insufficient points' });
    }

    const { error: updateError } = await supabase
      .from('members')
      .update({ points: newPoints })
      .eq('member_id', member_id);

    if (updateError) throw updateError;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ member_id, name, points_updated: pointsChange, description, type, updated_by, status }]);

    if (error) throw error;

    res.status(201).json({ status: 'success', message: 'Transaction created successfully', data });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred while creating transaction' });
  }
};


// Get transaction history by member_id
const getTransactionHistory = async (req, res) => {
  try {
    const { member_id } = req.params;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('member_id', member_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred while fetching transaction history' });
  }
};

module.exports = {
  addTransaction,
  getTransactionHistory
};
