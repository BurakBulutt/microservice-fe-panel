import {FaThumbsDown, FaThumbsUp} from "react-icons/fa";

const Reply = (props) => {
    const {data} = props;

    const cartCurt = (item) => {
        const getInitials = (name) => name.charAt(0).toUpperCase();

        return (
            <div key={item.id} className="flex items-start space-x-4 p-4 border-b border-gray-200">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg flex-shrink-0">
                    {getInitials(item.user.firstName)}
                </div>

                <div className="flex flex-col flex-1">
                    <p className="font-semibold text-gray-900">{item.user.firstName}</p>
                    <p className="text-gray-700 break-words">{item.content}</p>
                    <div className="flex items-center space-x-2 mt-2 text-gray-600">
                        <div className="flex items-center space-x-1 text-blue-500">
                            <FaThumbsUp />
                            <span>{item.likeCount?.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-500">
                            <FaThumbsDown />
                            <span>{item.likeCount?.dislikeCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return data && data.map((item) => cartCurt(item));
}

export default Reply;