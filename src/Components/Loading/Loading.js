import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="card-skeleton">
        <div className="img"></div>
        <div className="line title"></div>
        <div className="line price"></div>
      </div>
    </div>
  );
}
