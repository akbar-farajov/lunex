import { getChats } from "@/actions/chat";
import { Header } from "../components";
import { RecentsList } from "./components/recents-list";

const ITEMS_PER_PAGE = 5;

const RecentsPage = async () => {
  const initialChats = await getChats(ITEMS_PER_PAGE, 0);
  console.log(initialChats);

  return (
    <div className="flex flex-col h-full">
      <Header
        leftContent={
          <span className="text-sm font-medium line-clamp-1">Recents</span>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <RecentsList initialChats={initialChats || []} />
        </div>
      </div>
    </div>
  );
};

export default RecentsPage;
