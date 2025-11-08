import ComercioPage from "../app/[slug]/page";
interface ComercioPageProps {
  params: Promise<{ slug: string }>;
}

const HomePage = ({}:ComercioPageProps) => {
  return <ComercioPage params={Promise.resolve({ slug: "akemi" })} />;
};

export default HomePage;
