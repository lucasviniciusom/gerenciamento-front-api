import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Gerenciamento</h2>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/projects" style={styles.link}>Projetos</Link> {/* Alterado para /projects */}
        </li>
        <li>
          <Link to="/tasks" style={styles.link}>Tarefas</Link> {/* Adicionado link para tarefas */}
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#282c34',
    padding: '10px 20px',
  },
  logo: {
    color: '#61dafb',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
  },
  link: {
    color: '#fff',
    margin: '0 10px',
    textDecoration: 'none',
    fontSize: '18px',
  }
};

export default Navbar;
