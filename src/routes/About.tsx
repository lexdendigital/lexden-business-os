import React from 'react';

export function About() {
  return (
    <main className="screen">
      <div className="card">
        <h2>About LEXDEN FORGE</h2>
        <p className="sub">
          LEXDEN FORGE helps Nigerian hustlers launch, market, track and grow real businesses from a phone.
        </p>
      </div>

      <div className="card founder-row">
        <div className="founder-avatar" aria-hidden="true">
          LD
        </div>
        <div>
          <h3>Built by LEXDEN DIGITAL</h3>
          <p className="small sub" style={{ marginBottom: 0 }}>
            Headed by <b>Destiny Anselem</b> - a Nigerian tech entrepreneur and hands-on builder of practical digital
            tools that help young people sell, earn, organize and grow from a phone.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Mission</h3>
        <p style={{ marginBottom: 0 }}>Help everyday hustlers become organized digital business owners.</p>
      </div>
    </main>
  );
}
