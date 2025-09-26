import { offersApi } from '@/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/category-data';
import { OffersInterface } from '@/data/product-data';
import { router } from '@inertiajs/react';
import {
    CreditCard,
    Filter,
    Heart,
    MapPin,
    Package,
    Search,
    ShoppingCart,
    Sparkles,
    Star,
    TrendingUp,
    Truck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RingLoader } from 'react-spinners';
import { toast } from 'sonner';

export default function Index() {
    const [offers, setOffers] = useState<OffersInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    // Llamada a la API
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const response = await offersApi.getAll();
                setOffers(response); // Ajusta según la estructura de tu API
            } catch (error) {
                console.error('Error fetching offers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const deleteOffer = async (id: number) => {
        try {
            await offersApi.delete(id);
            setOffers((prev) => prev.filter((offer) => offer.id !== id)); // Elimina del estado local
            toast.success('Product deleted successfully!');
            router.reload(); // Refresh the page to reflect changes
            // Optionally, you can refresh the offers list or update state here
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('An error occurred while deleting the product.');
        }
        return { deleteOffer };
    };

    const categoryNames = categories.slice(1).map((cat) => cat.name); // Skip "All Products"
    const conditions = Array.from(new Set(offers.map((p) => p.condition)));

    const filteredProducts = useMemo(() => {
        return offers.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' ||
                product.category === selectedCategory;
            const matchesCondition =
                selectedCondition === 'all' ||
                product.condition === selectedCondition;

            return matchesSearch && matchesCategory && matchesCondition;
        });
    }, [offers, searchTerm, selectedCategory, selectedCondition]);

    const calculateDiscountedPrice = (
        price: number,
        discount: number | null,
    ) => {
        if (!discount) return price;
        return price * (1 - discount / 100);
    };

    const calculateSavings = (price: number, discount: number | null) => {
        if (!discount) return 0;
        return price * (discount / 100);
    };

    const toggleFavorite = (productId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking favorite button
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

    const getImageUrl = (imagePath: string) => {
        const isAbsoluteUrl =
            imagePath.startsWith('http://') || imagePath.startsWith('https://');

        if (isAbsoluteUrl) {
            return imagePath;
        } else {
            return `/storage${imagePath}`;
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'new':
                return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
            case 'like-new':
                return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
            case 'used':
                return 'bg-muted/50 text-muted-foreground border-border';
            default:
                return 'bg-muted/50 text-muted-foreground border-border';
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < Math.floor(rating)
                        ? 'fill-sunset-primary text-sunset-primary'
                        : i < rating
                          ? 'fill-sunset-primary/50 text-sunset-primary'
                          : 'text-muted-foreground'
                }`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex items-center gap-4">
                    <p className="text-lg">loading page</p>
                    <RingLoader color="#ff7e5f" size={35} />
                </div>
            </div>
        );
    }

    return (
        <div className="gradient-mesh min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-border/30 bg-background/90 backdrop-blur-xl">
                <div className="sunset-gradient absolute inset-0 opacity-5"></div>
                <div className="relative container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-sunset-glow border-sunset rounded-xl border p-2">
                                        <Sparkles className="text-sunset-primary h-6 w-6" />
                                    </div>
                                    <h1 className="bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-5xl font-bold text-balance text-transparent">
                                        Sunset Marketplace
                                    </h1>
                                </div>
                                <p className="max-w-2xl text-xl font-medium text-pretty text-muted-foreground">
                                    Discover extraordinary products bathed in
                                    golden hour elegance
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button className="cursor-pointer text-sm font-semibold">
                                    <Package className="mr-2 h-5 w-5" />
                                    Create Offer
                                </Button>
                                <Badge
                                    variant="secondary"
                                    className="border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
                                >
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    {filteredProducts.length} Products
                                </Badge>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col gap-6 lg:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search for your perfect find..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="h-12 border-border/40 bg-card/60 pl-12 text-lg backdrop-blur-sm placeholder:text-muted-foreground/70 focus:border-accent/50 focus:ring-accent/20"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="h-12 w-52 border-border/40 bg-card/60 backdrop-blur-sm">
                                        <Filter className="mr-2 h-4 w-4 text-accent" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categoryNames.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedCondition}
                                    onValueChange={setSelectedCondition}
                                >
                                    <SelectTrigger className="h-12 w-44 border-border/40 bg-card/60 backdrop-blur-sm">
                                        <SelectValue placeholder="Condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Conditions
                                        </SelectItem>
                                        {conditions.map((condition) => (
                                            <SelectItem
                                                key={condition}
                                                value={condition}
                                            >
                                                {condition
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    condition.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => {
                        const discountedPrice = calculateDiscountedPrice(
                            product.price,
                            product.discount,
                        );
                        const savings = calculateSavings(
                            product.price,
                            product.discount,
                        );
                        const isFavorite = favorites.has(product.id);

                        return (
                            <Card
                                key={product.id}
                                className="card-hover group relative cursor-pointer overflow-hidden border-border/30 bg-card/90 backdrop-blur-sm"
                                onClick={() =>
                                    router.visit(`/marketplace/${product.id}`)
                                } // Navigate to product detail page
                            >
                                <div className="bg-sunset-glow absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                                <div className="relative">
                                    <div className="relative aspect-square overflow-hidden bg-muted/10">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.alt}
                                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        {product.discount && (
                                            <Badge className="absolute top-4 left-4 bg-destructive/90 px-3 py-1 text-sm font-bold text-destructive-foreground backdrop-blur-sm">
                                                -{product.discount}%
                                            </Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`absolute top-4 right-4 backdrop-blur-md transition-all duration-300 ${
                                                isFavorite
                                                    ? 'scale-110 bg-destructive/20 text-destructive hover:bg-destructive/30'
                                                    : 'bg-background/20 text-foreground hover:scale-110 hover:bg-background/40'
                                            }`}
                                            onClick={(e) =>
                                                toggleFavorite(product.id, e)
                                            }
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
                                            />
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="relative space-y-4 p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="group-hover:text-sunset-primary text-xl leading-tight font-bold text-balance text-foreground transition-colors duration-300">
                                                {product.name}
                                            </h3>
                                            <Badge
                                                className={`text-xs font-medium ${getConditionColor(product.condition)}`}
                                            >
                                                {product.condition}
                                            </Badge>
                                        </div>

                                        <p className="line-clamp-2 leading-relaxed text-pretty text-muted-foreground">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                {renderStars(
                                                    product.discount || 15,
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {product.discount}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                ({product.discount})
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price Section */}
                                    <div className="space-y-2 py-2">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-sunset-primary text-3xl font-bold">
                                                ${discountedPrice.toFixed(2)}
                                            </span>
                                            {product.discount && (
                                                <span className="text-lg text-muted-foreground line-through">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        {product.discount && (
                                            <div className="flex items-center gap-2">
                                                <p className="rounded-md bg-chart-2/10 px-2 py-1 text-sm font-semibold text-chart-2">
                                                    Save ${savings.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ({product.discount}% off)
                                                </p>
                                            </div>
                                        )}
                                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CreditCard className="h-4 w-4 text-accent" />
                                            {product.installments}
                                        </p>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-3 border-t border-border/40 pt-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4 text-accent" />
                                                {product.location}
                                            </span>
                                            <span className="flex items-center gap-2 font-medium text-chart-2">
                                                <Truck className="h-4 w-4" />
                                                {product.shipping}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">
                                                by {product.seller}
                                            </span>
                                            <span
                                                className={`font-semibold ${product.stock.includes('Only') ? 'text-chart-4' : 'text-chart-2'}`}
                                            >
                                                {product.stock}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            className="h-11 flex-1 bg-primary font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                                            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking add to cart
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-11 w-11 border-border/40 bg-transparent transition-all duration-300 hover:border-accent/40 hover:bg-accent/10"
                                            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking star button
                                        >
                                            <Star className="h-5 w-5 text-accent" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="space-y-4">
                            <div className="bg-sunset-glow mx-auto flex h-24 w-24 items-center justify-center rounded-full">
                                <Search className="text-sunset-primary h-12 w-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-foreground">
                                    No products found
                                </h3>
                                <p className="mx-auto max-w-md text-lg text-pretty text-muted-foreground">
                                    Try adjusting your search terms or filters
                                    to discover more amazing products
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
