import toastr from 'toastr';
import React, { useEffect, useState } from 'react';
import { getVersion } from '../../api_calls';

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getVersion()
      .then(result => setData(result.data))
      .catch(error => toastr.error(error));
  }, []);

  return (
    <div>
      <p>Welcome to the about page.</p>
      <p>Current API version is: {data}</p>
      <p>Current time is: {new Date().toISOString()}</p>
    </div>
  );
}
