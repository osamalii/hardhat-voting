export const styles = {
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    brand: {
      flexGrow: 1,
      fontSize: "24px",
    },
    connectedAccount: {
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
    },
    section: {
      flex: 1,
      marginTop: "20px",
      paddingBottom: "50px",
    },
    container: {
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    },
    footer: {
      textAlign: "center",
      padding: "20px",
      fontSize: "14px",
      background: "linear-gradient(45deg, #1976d2 30%, #2196F3 90%)",
      marginTop: "auto", // Push the footer to the bottom
    },
    header: {
      background: "linear-gradient(45deg, #1976d2 30%, #2196F3 90%)",
      color: "#fff",
      marginBottom: "20px",
      padding: "10px 0",
    },
    button: {
      background: "#1976d2",
      color: "#fff",
      borderRadius: "5px",
      padding: "10px 20px",
      margin: "10px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      "&:hover": {
        background: "#1565c0",
      },
    },
    paper: {
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    },
    errorAlert: {
      position: "fixed",
      top: "70px", // Adjust this value to control the vertical position
      right: "20px",
    },
  };