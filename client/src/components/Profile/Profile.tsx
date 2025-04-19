import { FC } from "react"
import { LogoutButton } from "../LogoutButton"
import { UserView } from "../UserView"
import { User } from "../../api/User";
import { FetchNotesListView } from "../NotesListView/FetchNotesListView";
import './Profile.css';
import { NoteForm } from "../NoteForm";

interface AccountProps {
    user: User;
}

export const Profile: FC<AccountProps> = ({ user }) => {
    return (
        <div className="profile">
            <div className="profile-header">
                <UserView user={user} />
                <LogoutButton />
            </div>
            <div className="profile-body">
                <NoteForm />
                <FetchNotesListView />
            </div>
        </div>
    )
}

