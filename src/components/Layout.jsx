import React from "react";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="app-header">
        <h1>DishDelight</h1>
      </header>

      <main className="app-content">{children}</main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} DishDelight. All rights reserved.</p>
      </footer>
    </div>
  );
}
