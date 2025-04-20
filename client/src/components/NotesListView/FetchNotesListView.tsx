import { useQuery } from "@tanstack/react-query";
import { fetchNotesList } from "../../api/Note";
import { Loader } from "../Loader";
import { NotesListView } from "./NotesListView";
import { queryClient } from "../../api/QueryClient";
import { useState } from "react";
import { PageSelector } from "../PageSelector";

export const FetchNotesListView = () => {
    const [page, setPage] = useState(0);

    const notesListQuery = useQuery({
        queryFn: () => fetchNotesList({page, pageSize: 6}),
        queryKey: ['notes', page],
        retry: false
    }, queryClient);

    const handleChangePage = (page: number) => {
        setPage(page)
        queryClient.invalidateQueries({queryKey: ['notes']})
    }

    switch (notesListQuery.status) {
        case 'pending':
            return <Loader />

        case 'success':
            return (
                <div className="note-list-view">
                    {notesListQuery.data?.list.length > 0 ?
                        <>
                            <div className="">
                                <NotesListView notes={notesListQuery.data} />
                            </div>
                            <div className="note-list-view__pagination">
                                {notesListQuery.data.pageCount > 1 ?
                                    <PageSelector
                                        currentPage={ page + 1 }
                                        canSelectNext={ page === (notesListQuery.data.pageCount - 1) ? false : true }
                                        canSelectPrev={ page === 0 ? false : true }
                                        onNextClick={() => handleChangePage(page + 1)}
                                        onPrevClick={() => handleChangePage(page - 1)}
                                    /> : null
                                }
                            </div>
                        </> :
                        <span>У вас ещё нет заметок.</span>
                    }
                    
                </div>
                
            )

        case 'error':
            return <span>Ошибка при загрузке заметок.</span>

    }
}