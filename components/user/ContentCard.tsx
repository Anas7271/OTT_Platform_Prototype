interface ContentCardProps {
  content: {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnailPath: string;
    uploadTime: string;
    accessLevel: string;
  };
}

export default function ContentCard({ content }: ContentCardProps) {
  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'lite':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getAccessLevelText = (level: string) => {
    switch (level) {
      case 'premium':
        return 'Premium';
      case 'lite':
        return 'Lite';
      default:
        return 'Free';
    }
  };

  return (
    <div className="card w-full max-w-sm hover:shadow-lg transition-shadow">
      <div className="p-0">
        <div className="relative">
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelBadge(
              content.accessLevel
            )}`}>
              {getAccessLevelText(content.accessLevel)}
            </span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{content.category}</span>
          <span>{new Date(content.uploadTime).toLocaleDateString()}</span>
        </div>
        <button className="btn btn-primary w-full" disabled>
          View Details
        </button>
      </div>
    </div>
  );
}