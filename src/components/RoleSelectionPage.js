import React from "react";
import { Link } from "react-router-dom";

const RoleSelectionPage = () => {
  return (
    <div>
      <h2>Select Your Role</h2>
      <Link to="/admin">
        <button>Admin</button>
      </Link>
      <br />
      <Link to="/farmer">
        <button>Farmer</button>
      </Link>
      <br />
      <Link to="/buyer">
        <button>Buyer</button>
      </Link>
    </div>
  );
};

export default RoleSelectionPage;
