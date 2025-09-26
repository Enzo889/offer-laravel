'use client';

import { offersApi } from '@/api'; // Usar la API
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OffersInterface } from '@/data/product-data';
import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Clock,
    CreditCard,
    Heart,
    MapPin,
    Package,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
    Verified,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { RingLoader } from 'react-spinners';

interface ProductDetailPageProps {
    id: string; // Viene desde Laravel como prop
}

export default function ProductDetailPage({ id }: ProductDetailPageProps) {
    const [product, setProduct] = useState<OffersInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTab, setSelectedTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await offersApi.getById(id);
                setProduct(data);
            } catch (err) {
                setError(`Product not found, ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const getImageUrl = (imagePath: string) => {
        const isAbsoluteUrl =
            imagePath.startsWith('http://') || imagePath.startsWith('https://');

        if (isAbsoluteUrl) {
            return imagePath;
        } else {
            return `/storage${imagePath}`;
        }
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

    if (error || !product) {
        return (
            <div className="gradient-mesh flex min-h-screen items-center justify-center bg-background">
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        {error || 'Product not found'}
                    </h1>
                    <Button onClick={() => router.visit('/marketplace')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Button>
                </div>
            </div>
        );
    }

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;
    const savings = product.discount
        ? product.price * (product.discount / 100)
        : 0;

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

    return (
        <div className="gradient-mesh min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-border/30 bg-background/90 backdrop-blur-xl">
                <div className="sunset-gradient absolute inset-0 opacity-5"></div>
                <div className="relative container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/marketplace')}
                            className="cursor-pointer hover:bg-accent/10 hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Marketplace
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Marketplace</span>
                            <span>/</span>
                            <span>{product.category}</span>
                            <span>/</span>
                            <span className="font-medium text-foreground">
                                {product.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/30 bg-card/60">
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.alt}
                                className="h-full w-full object-cover"
                            />
                            {product.discount && (
                                <Badge className="absolute top-6 left-6 bg-destructive/90 px-4 py-2 text-lg font-bold text-destructive-foreground">
                                    -{product.discount}%
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl leading-tight font-bold text-balance">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            {renderStars(
                                                product.discount || 15,
                                            )}
                                            <span className="ml-2 text-sm font-medium">
                                                {product.discount}
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            ({product.discount} reviews)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        className={`text-sm font-medium ${getConditionColor(product.condition)}`}
                                    >
                                        {product.condition}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setIsFavorite(!isFavorite)
                                        }
                                        className={`transition-all ${
                                            isFavorite
                                                ? 'text-destructive hover:text-destructive/80'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <Heart
                                            className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`}
                                        />
                                    </Button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-3 py-4">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-sunset-primary text-5xl font-bold">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    {product.discount && (
                                        <span className="text-2xl text-muted-foreground line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {product.discount && (
                                    <div className="flex items-center gap-3">
                                        <Badge className="border-chart-2/20 bg-chart-2/10 px-3 py-1 text-base text-chart-2">
                                            Save ${savings.toFixed(2)} (
                                            {product.discount}% off)
                                        </Badge>
                                    </div>
                                )}
                                <p className="flex items-center gap-2 text-lg text-muted-foreground">
                                    <CreditCard className="h-5 w-5 text-accent" />
                                    {product.installments}
                                </p>
                            </div>

                            {/* Seller Info */}
                            <Card className="border-border/30 bg-card/60">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-lg font-semibold">
                                                    Sold by {product.seller}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4 text-accent" />
                                                    {product.location}
                                                </div>
                                            </div>
                                            {product.isOwner && (
                                                <Badge className="border-chart-2/20 bg-chart-2/10 text-chart-2">
                                                    <Verified className="mr-1 h-3 w-3" />
                                                    Verified Seller
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Truck className="h-4 w-4 text-chart-2" />
                                                <span className="font-medium text-chart-2">
                                                    {product.shipping}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-accent" />
                                                <span
                                                    className={`font-medium ${product.stock.includes('Only') ? 'text-chart-4' : 'text-chart-2'}`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button className="h-14 flex-1 bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90">
                                    <ShoppingCart className="mr-3 h-6 w-6" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14 border-border/40 bg-transparent"
                                >
                                    <Share2 className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div className="flex gap-8 border-b border-border/30">
                        {['description', 'specifications', 'reviews'].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`relative px-2 pb-4 text-lg font-semibold capitalize transition-colors ${
                                        selectedTab === tab
                                            ? 'text-sunset-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab}
                                    {selectedTab === tab && (
                                        <div className="bg-sunset-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full" />
                                    )}
                                </button>
                            ),
                        )}
                    </div>

                    <div className="py-12">
                        {selectedTab === 'description' && (
                            <div className="max-w-4xl space-y-6">
                                <h3 className="text-2xl font-bold">
                                    Product Description
                                </h3>
                                <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
                                    {product.description}
                                </p>
                                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
                                    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4">
                                        <Shield className="h-8 w-8 text-chart-2" />
                                        <div>
                                            <p className="font-semibold">
                                                Quality Guaranteed
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                30-day return policy
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4">
                                        <Clock className="h-8 w-8 text-accent" />
                                        <div>
                                            <p className="font-semibold">
                                                Fast Shipping
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                2-3 business days
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4">
                                        <Award className="h-8 w-8 text-chart-3" />
                                        <div>
                                            <p className="font-semibold">
                                                Premium Quality
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Carefully selected
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'specifications' && (
                            <div className="max-w-2xl space-y-6">
                                <h3 className="text-2xl font-bold">
                                    Specifications
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(product.description).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between border-b border-border/20 py-3"
                                            >
                                                <span className="font-medium text-muted-foreground">
                                                    {key}
                                                </span>
                                                <span className="font-semibold">
                                                    {value}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'reviews' && (
                            <div className="max-w-4xl space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold">
                                        Customer Reviews
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {renderStars(
                                                product.discount || 15,
                                            )}
                                            <span className="text-xl font-bold">
                                                {product.discount}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            Based on {product.discount} reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
