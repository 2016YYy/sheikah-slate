import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import CategoryPage from '@/pages/CategoryPage/CategoryPage';
import DetailPage from '@/pages/DetailPage/DetailPage';
import QuestsPage from '@/pages/QuestsPage/QuestsPage';
import QuestDetailPage from '@/pages/QuestDetailPage/QuestDetailPage';
import GuidesPage from '@/pages/GuidesPage/GuidesPage';
import GuideReaderPage from '@/pages/GuideReaderPage/GuideReaderPage';
import ProgressPage from '@/pages/ProgressPage/ProgressPage';
import FavoritesPage from '@/pages/FavoritesPage/FavoritesPage';
import AboutPage from '@/pages/AboutPage/AboutPage';
import NotFound from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="detail/:category/:id" element={<DetailPage />} />
        <Route path="quests" element={<QuestsPage />} />
        <Route path="quests/:id" element={<QuestDetailPage />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="guides/:id" element={<GuideReaderPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
