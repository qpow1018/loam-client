import { getAllClassInfos } from '@/app/my-characters/_util/lostark';

export default function TestClassesPage() {
  const allClassInfos = getAllClassInfos();

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>클래스 이미지 검증</h1>
      <p style={{ color: '#aaa', fontSize: 13, marginBottom: 24 }}>
        깨진 이미지는 alt 텍스트가 보이거나 빈 회색 박스로 나타납니다.
      </p>

      {allClassInfos.map(({ mainClassInfo, classes }) => (
        <section key={mainClassInfo.value} style={{ marginBottom: 32 }}>
          <h2 style={{ borderBottom: '1px solid #555', paddingBottom: 4, marginBottom: 16 }}>
            {mainClassInfo.label}{' '}
            <span style={{ color: '#888', fontSize: 14, fontWeight: 400 }}>
              ({mainClassInfo.value})
            </span>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {classes.map((c) => (
              <div key={c.value} style={{ width: 120, textAlign: 'center' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#3f3f46',
                    margin: '0 auto',
                  }}
                >
                  <img
                    src={c.imageUrl}
                    alt={c.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <p style={{ fontSize: 13, marginTop: 8, marginBottom: 4 }}>{c.label}</p>
                <p style={{ fontSize: 10, color: '#888', wordBreak: 'break-all' }}>
                  {c.imageUrl.split('/').pop()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
