const supabase = require('../supabaseClient');

const getMembers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*');

    if (error) {
      console.error("Error fetching members:", error);
      return res.status(500).json({ error: 'An error occurred while fetching members' });
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMembers };
