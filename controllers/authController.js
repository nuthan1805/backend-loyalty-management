const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
      const { data, error } = await supabase
          .from('users')
          .select('email')
          .eq('email', email);

      if (data.length > 0) {
          return res.status(400).json({ message: 'Email already exists' });
      }
      const { data: usernameData, error: usernameError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username);

      if (usernameData.length > 0) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: insertError } = await supabase
          .from('users')
          .insert([{ username, email, password: hashedPassword, login_status: 0 }]);

      if (insertError) {
          throw insertError;
      }

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (error || !data) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: data.id, username: data.username, email: data.email }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });

    let loginStatus = data.login_status;

    if (loginStatus === 0) {
      loginStatus = 1;
    } else if (loginStatus === 1) {
      loginStatus = 2;
    }

    await supabase
      .from('users')
      .update({ login_status: loginStatus })
      .eq('id', data.id);

    res.status(200).json({ token, username: data.username, email: data.email, loginStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

