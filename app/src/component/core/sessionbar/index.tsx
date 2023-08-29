import ProfileButton from "@/component/profile/button";

const Sessionbar = () => {
    return (
        <div className='h-24 flex items-center'>
            <div className='ml-auto p-4'>
                <ul className='flex gap-4 justify-items-center'>
                    <ProfileButton />
                </ul>
            </div>
        </div>
    );
}

export default Sessionbar;