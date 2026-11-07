
function Navbar({ cartCount }) {
  return (
    <header className="navbar">
      <a className="logo" href="#home">
        Sweet Crumbs<span>.</span>
      </a>

      <nav>
        <a href="#home">Home</a>
        <a href="#menu">Our Menu</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#cart">Cart ({cartCount})</a>
      </nav>

      <a href="#menu" className="nav-button">
        Order Now
      </a>
    </header>
  );
}

export default Navbar;
