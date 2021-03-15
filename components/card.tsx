import Author from './author';

type CardProps = {
  title: string;
  image?: string;
}

export default function Card({ title, image }: CardProps) {
  return (
    <div id="card" className="card-container">
      <div className="card-inner">
        <div className="card-top">
          <span className="url">douglasmoura.dev</span>
        </div>
        <div className="card-content">
          <div className="card-content-title">
            <h1>{title}</h1>
          </div>
        </div>
        <div className="card-bottom">
          <Author name="@douglasdemoura" />
        </div>
        <div className="card-image">
          <div className="card-image-container">
            <img src={image ? image : '/uploads/card/default.jpg'} />
          </div>
        </div>
      </div>
    </div>
  );
}
