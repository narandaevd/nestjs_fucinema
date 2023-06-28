class AboutFilmProps {
  title: string;
  companyName: string;
  companyCountry: string;
};

export function AboutFilm(
  {title, companyName, companyCountry}: AboutFilmProps
): React.ReactElement {
  return (
    <div className="full__film__info__about">
      <div className="full__film__info__all">
          <div className="full__film__info__title">
              {title}
          </div>
          <div style={{
            margin: '20px 0 5px 0',
            fontWeight: 500,
            fontSize: '24px'
          }}>О фильме:</div>
          <div className="full__film__info__detail">
              <div className="full__film__info__detail__left-side">
                  <div>Компания:</div>
                  <div>Страна компании:</div>
              </div>
              <div className="full__film__info__detail__right-side">
                  <div>{companyName}</div>
                  <div>{companyCountry}</div>
              </div>
          </div>
      </div>
    </div>
  )
}
