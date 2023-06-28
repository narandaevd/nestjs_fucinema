export class FilmData {
  uuid: string;
  title: string;
  description?: string;
}

export function Film({
  uuid, 
  description,
  title
}: FilmData): React.ReactElement {
  return (
    <a href={`/films/${uuid}`}>
      <div className="list__item">
        <div className="list__item__image">
          <img src="/img/no-image.jpg" alt="" />
        </div>
        <div className="list__item__info">
          <div className="list__item__title">{title}</div>
          <div className="list__item__descr">
              {description ? description : '-'}
          </div>
        </div>
      </div>
    </a>
  )
}
