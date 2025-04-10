export default function SubmitButton({ loading, text }) {
    return (
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Aguarde..." : text}
      </button>
    );
  }
  