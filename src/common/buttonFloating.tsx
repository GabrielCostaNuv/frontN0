// const FloatingButton: React.FC = () => {
//     return (
//       <button 
//         style={{
//           position: 'fixed',
//           top: '50%',
//           left: '10px',
//           transform: 'translateY(-50%)',
//           zIndex: 9999, // Crucial for visibility
//           width: '50px',
//           height: '50px',
//           backgroundColor: 'red', // Diagnostic color
//         }}
//       >
//         Test
//       </button>
//     );
//   };

const FloatingButton: React.FC = () => {
    return (
      <button 
        style={{
          position: 'absolute', // Changed from 'fixed'
          top: '50%', 
          left: '0', 
          transform: 'translateY(-50%)',
          zIndex: 9999,
          width: '50px',
          height: '50px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '0 10px 10px 0', // Rounded right side
          cursor: 'pointer'
        }}
      >
        ☰
      </button>
    );
  };

  export default FloatingButton;