import { SubtitleHeader, TitleHeader } from '../components/ContentStyling';

export default function TodayLayout({ children }) {
  return (
    <>
      <TitleHeader
        variant="h4"
        sx={{ typography: { xs: 'h5', md: 'h4' } }}
        content="Good day, Procheta!"
      />
      <SubtitleHeader
        variant="subtitle1"
        content="Here's Juno's care overview for today"
      />
      {children}
    </>
  );
}
