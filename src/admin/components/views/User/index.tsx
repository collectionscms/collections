import React from 'react';

const User = () => {
  const columNames = ['name', 'email', 'role', 'username', 'user status'];
  const collections = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Henderson',
      email: 'alice@example.com',
      role: 'Admin',
      username: 'alice',
      status: 'Active',
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Sanders',
      email: 'bob@example.com',
      role: 'Editor',
      username: 'bob',
      status: 'Invited',
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          {columNames.map((n) => (
            <th key={n}>{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {collections.map((u) => (
          <tr key={u.id}>
            <td>
              {u.firstName} {u.lastName}
            </td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.username}</td>
            <td>{u.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default User;
