import jwt from 'jsonwebtoken';

(async () => {
  try {
    const user = jwt.verify(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NjcwMjVlMi1kZWU5LTQyNzUtYWZhMC0zN2VlMmFhMmRhZDAiLCJpYXQiOjE2MzI5OTY4NDQsImV4cCI6MTYzMzYwMTY0NH0.bJhUwjIo27-qm-cHEEf5zRcjOmvHuF8Hdrl5owN9Lck',
      'fdjaskfjsadkfjksadf',
    );
    console.log(user);
  } catch (err) {
    console.log(err);
  }
})();
