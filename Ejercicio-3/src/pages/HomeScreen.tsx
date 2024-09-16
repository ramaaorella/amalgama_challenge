import { useToast } from "@/hooks/use-toast";
import { getBooks } from "@/services/api/services/books";
import { getUsers } from "@/services/api/services/users";
import { useEffect, useState } from "react";
import { Loader2Icon as LoaderIcon } from "lucide-react";
import { AxiosError } from "axios";

const HomeScreen = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        const [booksResponse, usersResponse] = await Promise.all([
          getBooks(),
          getUsers(),
        ]);
        setBooks(booksResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        let errorMessage = "Ocurrió un error. Inténtenlo nuevamente";
        console.log(error);
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.description || error.message;
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [toast]);

  if (loading)
    return <LoaderIcon className="ml-8 mt-8 mr-2 h-4 w-4 animate-spin" />;

  return (
    <div className="p-8">
      <h1 className="text-lg font-bold">Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            "{book.title}" - {book.author.name}
          </li>
        ))}
      </ul>
      <h1 className="text-lg font-bold">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.email}>
            {user.nickname} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeScreen;
