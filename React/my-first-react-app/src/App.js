// import Gallery from './Gallery.js';
// import Profile from './Profile.js';

// export default function App() {
//   return (
//     <div>
//       <Gallery />
//       <Profile />
//     </div>
//   );
// }

const today = new Date();

function formatDate(date) {
  return Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}