const supabase = require('../supabaseClient');

// Get all members
const getMembers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*');

    if (error) {
      console.error("Error fetching members:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while fetching members' });
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while fetching users' });
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// Add a new member
const addMember = async (req, res) => {
  const { name, email, member_id, points } = req.body;

  try {
    const { data, error } = await supabase
      .from('members')
      .insert([{ name, email, member_id, points }])
      .select('*'); 

    if (error) {
      console.error("Error adding member:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while adding the member' });
    }

    res.status(201).json({ status: 'success', message: 'Member created successfully', data: data[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete a member by member_id
const deleteMember = async (req, res) => {
  const { member_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('members')
      .delete()
      .eq('member_id', member_id)
      .select('*'); 

    if (error) {
      console.error("Error deleting member:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while deleting the member' });
    }


    if (data.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    res.json({ status: 'success', message: 'Member deleted successfully', data: data[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Update a member by member_id
const updateMember = async (req, res) => {
  const { member_id } = req.params;
  const { name, email, points } = req.body;

  try {
    const { data, error } = await supabase
      .from('members')
      .update({ name, email, points })
      .eq('member_id', member_id)
      .select('*'); 

    if (error) {
      console.error("Error updating member:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while updating the member' });
    }

    if (data.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    res.json({ status: 'success', message: 'Member updated successfully', data: data[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getMemberById = async (req, res) => {
  const { member_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('member_id', member_id)
      .single(); 

    if (error) {
      console.error("Error fetching member details:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while fetching member details' });
    }

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }

    res.json({ status: 'success', data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getUserByNameOrEmail = async (req, res) => {
  const { identifier } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${identifier},email.eq.${identifier}`)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while fetching user details' });
    }

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


module.exports = { getMembers, addMember, deleteMember, updateMember, getMemberById, getUsers,getUserByNameOrEmail };


