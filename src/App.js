import { useState } from "react";
import axios from "axios";
import styles from "./app.module.css";

export default function Home() {
  const [cpfValue, setCpfValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (event) => {
    let value = event.target.value;

    // Remove any non-numeric characters from the input
    value = value.replace(/\D/g, "");

    // Apply the mask for Brazilian CPF format (XXX.XXX.XXX-XX)
    if (value.length <= 3) {
      value = value.replace(/(\d{1,3})/, "$1");
    } else if (value.length <= 6) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    } else if (value.length <= 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    }

    setCpfValue(value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      setResult(null);

      try {
        const response = await axios.post(
          `http://localhost:3030/query/${cpfValue}`
        );
        setResult(response.data);
      } catch (error) {
        console.error("Error while calling API:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Crawler API Test Page</h1>
      <div className={styles.inputContainer}>
        <label htmlFor="cpfInput">CPF:</label>
        <input
          type="text"
          id="cpfInput"
          value={cpfValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <small>Press Enter to send request</small>
      {loading && <p className={styles.loading}>Loading...</p>}
      {result && (
        <div
          className={`${styles.resultContainer} ${
            result && !loading ? styles.fadeIn : ""
          }`}
        >
          <p>Result:</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
