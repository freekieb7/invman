import NotificationBell from "@/component/notification/bell";
import ProfileAvatar from "@/component/profile/avatar";

const Sessionbar = () => {
    return (
        <ul className="h-full bg-default-100 rounded-full flex gap-6 items-center justify-end p-2">
            <div className="w-12 h-12 p-2">
                <NotificationBell />
            </div>
            <div className="w-12 h-12">
                <ProfileAvatar />
            </div>
        </ul>
    );
}

export default Sessionbar;