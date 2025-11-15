import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from './ui/button';

interface YouTubePreviewProps {
    url: string;
    title?: string;
    onRemove?: () => void;
}

export function YouTubePreview({ url, title, onRemove }: YouTubePreviewProps) {
    const [videoId, setVideoId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const extractVideoId = (url: string) => {
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/,
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return null;
        };

        setVideoId(extractVideoId(url));
        setIsPlaying(false);
    }, [url]);

    if (!videoId) {
        return null;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    return (
        <div className="relative group rounded-lg overflow-hidden border bg-muted/30">
            {!isPlaying ? (
                <div className="relative aspect-video">
                    <img
                        src={thumbnailUrl}
                        alt={title || 'YouTube video'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to default thumbnail if maxres not available
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                    {/* Play Button */}
                    <button
                        type="button"
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <div className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="h-8 w-8 text-white ml-1" fill="white" />
                        </div>
                    </button>

                    {/* Title Overlay */}
                    {title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="text-white text-sm font-medium line-clamp-2">
                                {title}
                            </p>
                        </div>
                    )}

                    {/* Remove Button */}
                    {onRemove && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div className="aspect-video">
                    <iframe
                        src={embedUrl}
                        title={title || 'YouTube video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Video Info */}
            <div className="p-3 bg-background/95 backdrop-blur-sm border-t">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                            youtube.com/watch?v={videoId}
                        </p>
                    </div>
                    {isPlaying && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPlaying(false)}
                            className="h-7 text-xs"
                        >
                            Tutup Player
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface YouTubeInputProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    error?: string;
    title?: string;
}

export function YouTubeInput({
    value,
    onChange,
    onBlur,
    placeholder = 'https://www.youtube.com/watch?v=...',
    error,
    title,
}: YouTubeInputProps) {
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        // Show preview if URL is valid
        const isValidUrl = value && /youtube\.com|youtu\.be/.test(value);
        setShowPreview(!!isValidUrl);
    }, [value]);

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Format yang didukung: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
                </p>
            </div>

            {showPreview && (
                <YouTubePreview
                    url={value}
                    title={title}
                    onRemove={() => {
                        onChange('');
                        setShowPreview(false);
                    }}
                />
            )}
        </div>
    );
}
