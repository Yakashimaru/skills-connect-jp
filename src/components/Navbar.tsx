// Navbar logo updated to use Marcellus serif for brand name
// Add to the NavLink className for the logo:

// Replace this line in Navbar.tsx:
// <NavLink to="/" className="text-xl font-semibold text-teal-500 tracking-tight">
//   skillconnect
// </NavLink>

// With this:
// <NavLink
//   to="/"
//   className="text-teal-500"
//   style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', letterSpacing: '0.02em' }}
// >
//   skillconnect
// </NavLink>

// And the Login link in Navbar mobile/auth area — replace the Sign up badge font:
// style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}
