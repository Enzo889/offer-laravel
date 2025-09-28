import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { offersApi } from '@/api';
import { categories } from '@/data/category-data';
import { OffersInterface } from '@/data/product-data';
import { Edit, Loader2, Package2Icon } from 'lucide-react';
import { toast } from 'sonner';

// Types and interfaces
interface OfferItem {
    id: string;
    title: string;
    price: number;
    discount?: number;
    category: string;
    condition: string;
    description: string;
    location: string;
    images?: string[];
    categoryId?: number;
}

interface EditItemProps {
    item?: OfferItem;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    price: z.string().min(1, 'Price is required'),
    discount: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    condition: z.string().min(1, 'Condition is required'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters'),
    location: z.string().min(3, 'Location is required'),
});

function EditItem({ item, onSuccess, onCancel }: EditItemProps) {
    // Solo una imagen por URL
    const [imageUrl, setImageUrl] = useState<string>(item?.images?.[0] || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item?.title || '',
            price: item?.price?.toString() || '',
            discount: item?.discount?.toString() || '0',
            category: item?.category || '',
            condition: item?.condition || '',
            description: item?.description || '',
            location: item?.location || '',
        },
    });

    useEffect(() => {
        if (item) {
            form.reset({
                title: item.title,
                price: item.price.toString(),
                discount: item.discount?.toString() || '0',
                category: item.category,
                condition: item.condition,
                description: item.description,
                location: item.location,
            });
            setImageUrl(item.images?.[0] || '');
        }
    }, [item, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const offerData: Partial<OffersInterface> = {
                name: values.title,
                price: parseFloat(values.price),
                discount: values.discount ? parseFloat(values.discount) : 0,
                category: values.category,
                condition: values.condition as 'new' | 'like-new' | 'used',
                description: values.description,
                location: values.location,
                image: imageUrl || '',
                categoryId:
                    categories.find((cat) => cat.name === values.category)
                        ?.id || 1,
            };

            if (item?.id) {
                await offersApi.update(item.id, offerData);
                toast.success('Offer updated successfully!');
            } else {
                await offersApi.create(offerData as OffersInterface);
                toast.success('Offer created successfully!');
            }

            setIsOpen(false);
            form.reset();
            setImageUrl('');
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error('Error submitting offer:', error);
            toast.error(
                item?.id ? 'Failed to update offer' : 'Failed to create offer',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.reset();
        setImageUrl(item?.images?.[0] || '');
        onCancel?.();
    };

    const removeImage = () => {
        setImageUrl('');
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {!item?.id ? (
                    <Button
                        asChild
                        className="cursor-pointer font-semibold"
                        onClick={() => setIsOpen(true)}
                    >
                        <DialogTrigger>
                            <Package2Icon />
                            Create Offer
                        </DialogTrigger>
                    </Button>
                ) : (
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 w-full cursor-pointer justify-start"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    >
                        <DialogTrigger>
                            {' '}
                            <Edit className="h-4 w-4" /> Edit{' '}
                        </DialogTrigger>
                    </Button>
                )}
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {item?.id ? 'Edit Offer' : 'Create New Offer'}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Product title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mb-4 flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Paste image URL here"
                                    value={imageUrl}
                                    onChange={(e) =>
                                        setImageUrl(e.target.value)
                                    }
                                    className="flex-1"
                                />
                                {imageUrl && (
                                    <div className="relative h-20 w-20">
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                        >
                                            ×
                                        </button>
                                        <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 truncate rounded-b-lg bg-black p-1 text-xs text-white">
                                            {imageUrl}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="00"
                                                    min={1}
                                                    max={1000}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="discount"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Discount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="00"
                                                    max="100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories
                                                        .filter(
                                                            (category) =>
                                                                category.id !==
                                                                    1 &&
                                                                category.id !==
                                                                    2,
                                                        )
                                                        .map((category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.name
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Condition</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select condition" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="new">
                                                        New
                                                    </SelectItem>
                                                    <SelectItem value="like-new">
                                                        Like New
                                                    </SelectItem>
                                                    <SelectItem value="used">
                                                        Used
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </span>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your item"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 cursor-pointer"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {item?.id
                                                ? 'Updating...'
                                                : 'Creating...'}
                                        </>
                                    ) : item?.id ? (
                                        'Update Offer'
                                    ) : (
                                        'Create Offer'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditItem;
