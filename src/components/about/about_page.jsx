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
      <p>This is the about page. Current API version is: {data}</p>
    </div>
  );
}
