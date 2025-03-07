export const Head: React.FC = () => {
  return (
    <>
      <title>Revite</title>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

              if (initialTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {
              console.error('Theme initialization error:', e);
            }
          })();
        `,
        }}
      />
    </>
  )
}
