const supabase = require('../supabaseClient');

const addTransaction = async (req, res) => {
  try {
    const { member_id, points, description } = req.body;

    if (!member_id || !points || !description) {
      return res.status(400).json({ error: 'Please provide member_id, points, and description' });
    }

    const { data: existingTransactions, error: existingError } = await supabase
      .from('transactions')
      .select('id')
      .eq('member_id', member_id);

    if (existingError) {
      throw existingError;
    }

    if (existingTransactions.length > 0) {
      return res.status(400).json({ error: 'Transaction for this member already exists. Use update to modify points.' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ member_id, points, description }]);

    if (error) {
      throw error;
    }

    res.status(201).json({ status: 'success', message: 'Transaction created successfully' });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'An error occurred while creating transaction' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { data, error } = await supabase.from('transactions').select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { member_id } = req.params;
    const { points, description } = req.body;

    if (!points || !description) {
      return res.status(400).json({ error: 'Please provide points and description' });
    }

    const { data: existingTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('member_id', member_id)
      .single();

    if (fetchError || !existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found for the given member ID' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ points, description, updated_at: new Date().toISOString() })
      .eq('member_id', member_id)
      .select();

    if (error) {
      throw error;
    }

    res.json({ status: 'success', message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'An error occurred while updating transaction' });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ status: 'success', message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'An error occurred while deleting transaction' });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { member_id } = req.params;

    if (!member_id) {
      return res.status(400).json({ error: 'Please provide a member_id' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('member_id', member_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'An error occurred while fetching transaction history' });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionHistory
};
