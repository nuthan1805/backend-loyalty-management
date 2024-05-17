const supabase = require('../supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ email, password: hashedPassword }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Admin registered successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(400).json({ error: 'Invalid credentials' });

  const validPass = await bcrypt.compare(password, data.password);
  if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);
  res.json({ token });
};

module.exports = { register, login };
