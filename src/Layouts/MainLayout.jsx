import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

export default function MainLayout({ children, usuario, onSalir }) {
  return (
    <>
      <Navbar usuario={usuario} onSalir={onSalir} />
      <div className="container">
        <h1>RegCal 🍽️</h1>
        {children}
      </div>
    </>
  );
}