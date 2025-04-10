export default function CriarPage({ titulo, children }) {  
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">{titulo}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}