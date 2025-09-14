import BottomTab from '@/components/BottomTab';
import Spinner from '@/components/Spinner';
import TextDefault from '@/components/TextDefault';
import TextError from '@/components/TextError';
import CategoryCard from '@/components/ui/CategoryCard/CategoryCard';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import { categoryApi } from '@/lib/categoryApi';
import { productApi } from '@/lib/productApi';
import { Product, } from '@/lib/types/product';
import { Category } from '@/lib/types/category';
import { alignment, colors, scale, verticalScale } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { JSX, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { RootDrawerParamList } from '@/lib/types/navigation';
import { DrawerNavigationProp } from '@react-navigation/drawer';



type MainLandingNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'MainLanding'>;

interface MainLandingProps {
    navigation: MainLandingNavigationProp;
}

const { height, width } = Dimensions.get('window')

const caroselImage = [
    require('../../../assets/images/MainLanding/banner-1.png'),
    require('../../../assets/images/MainLanding/recommended_2.png'),
    require('../../../assets/images/MainLanding/carosel_img_3.png'),
    require('../../../assets/images/MainLanding/banner-1.png'),
    require('../../../assets/images/MainLanding/recommended_2.png'),
    require('../../../assets/images/MainLanding/carosel_img_3.png')
]

function MainLanding(props: MainLandingProps) {
    const navigation = useNavigation<MainLandingNavigationProp>()
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async (isRefreshing: boolean = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError(null)

            const categoriesResult = await categoryApi.getCategories()
            if (categoriesResult.success && categoriesResult.data) {
                setCategories(categoriesResult.data.categories || [])
            } else if (!categoriesResult.success) {
                setError(categoriesResult.error || 'Failed to load categories')
            }

            const productsResult = await productApi.getProducts()
            if (productsResult.success && productsResult.data) {
                const productsData = productsResult.data.products || []
                setProducts(productsData)
                setFeaturedProducts(productsData.filter(item => item.featured))
            } else if (!productsResult.success) {
                setError(productsResult.error || 'Failed to load products')
            }

        } catch (err) {
            setError('Failed to load data')
            console.error('Data loading error:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    
    const handleRefresh = async () => {
        await loadData(true)
    }

    const renderCarosel = (): JSX.Element => {
        return (
            <View style={styles.caroselContainer}>
                <SwiperFlatList
                    data={caroselImage}
                    index={0}
                    showPagination
                    autoplay
                    autoplayDelay={3}
                    autoplayLoop={true}
                    paginationActiveColor="#fff"
                    paginationStyle={{ marginBottom: '7%' }}
                    paginationStyleItem={{
                        height: verticalScale(8),
                        width: verticalScale(8),
                        marginLeft: 0
                    }}
                    renderItem={({ item }) => (
                        <ImageBackground source={item} style={styles.caroselStyle} />
                    )}
                />
                <View style={styles.menuDrawerContainer}>
                    <MaterialIcons
                        name="menu"
                        size={scale(30)}
                        style={styles.leftIconPadding}
                        color={colors.fontSecondColor}
                        onPress={() => navigation.toggleDrawer()}
                    />
                </View>
            </View>
        )
    }

    const renderHeader = (): JSX.Element => {
        return (
            <>
                {renderCarosel()}
                <View style={styles.categoryContainer}>
                    {categories.map((category, index) => (
                        <CategoryCard
                            style={styles.spacer}
                            key={category._id || index}
                            cardLabel={category.title}
                            id={category._id}
                            title={category.title}
                        />
                    ))}
                </View>
                {featuredProducts.length > 0 && (
                    <View style={styles.titleSpacer}>
                        <TextDefault textColor={colors.fontMainColor} H4>
                            {'Featured'}
                        </TextDefault>
                        <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item._id}
                            data={featuredProducts}
                            renderItem={({ item }) => (
                                <ProductCard
                                    styles={styles.itemCardContainer}
                                    product={item}
                                    featured={item.featured}
                                />
                            )}
                        />
                    </View>
                )}
                <View style={styles.titleSpacer}>
                    <TextDefault textColor={colors.fontMainColor} H4>
                        {'All Items'}
                    </TextDefault>
                </View>
            </>
        )
    }

    if (error && !refreshing) {
        return (
            <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
                <View style={[styles.grayBackground, styles.flex, styles.centerContent]}>
                    <TextError text={error} />
                    <TextDefault
                        textColor={colors.primaryBlackColor}
                        style={styles.retryText}
                        onPress={handleRefresh}
                    >
                        Tap to retry
                    </TextDefault>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
            <View style={[styles.grayBackground, styles.flex]}>
                <FlatList
                    keyExtractor={(item, index) => item._id || index.toString()}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.primaryBlackColor]}
                        />
                    }
                    ListFooterComponent={loading ? <Spinner loading={true} backColor={undefined} size={'Large'} spinnerColor={undefined} /> : null}
                    ListHeaderComponent={renderHeader}
                    data={products}
                    renderItem={({ item }) => (
                        <ProductCard
                            styles={styles.productCard}
                            product={item}
                            featured={item.featured}
                        />
                    )}
                    ListEmptyComponent={
                        !loading && !error ? (
                            <View style={styles.emptyContainer}>
                                <TextDefault textColor={colors.fontSecondColor}>
                                    No products found
                                </TextDefault>
                            </View>
                        ) : null
                    }
                />
                <BottomTab screen="HOME" />
            </View>
        </SafeAreaView>
    )
}

export default MainLanding

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    safeAreaStyle: {
        backgroundColor: colors.headerbackground
    },
    leftIconPadding: {
        ...alignment.PLsmall,
        ...alignment.PRlarge
    },
    grayBackground: {
        backgroundColor: colors.backgroudGray
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    caroselContainer: {
        width: '100%',
        height: height * 0.3,
        position: 'relative'
    },
    caroselStyle: {
        width,
        height: height * 0.3
    },
    menuDrawerContainer: {
        position: 'absolute',
        top: '10%',
        left: '2%',
        zIndex: 10
    },
    categoryContainer: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        ...alignment.MTlarge
    },
    titleSpacer: {
        marginLeft: '5%',
        marginTop: scale(30)
    },
    itemCardContainer: {
        width: scale(180),
        height: scale(230),
        borderRadius: scale(5),
        borderColor: colors.whiteColor,
        borderWidth: scale(2),
        ...alignment.MTsmall,
        ...alignment.MRlarge
    },
    productCard: {
        marginLeft: '5%',
        width: '42%',
        height: scale(235),
        marginTop: scale(10),
        marginBottom: scale(20)
    },
    spacer: {
        ...alignment.MBsmall
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20)
    },
    retryText: {
        marginTop: scale(10),
        textDecorationLine: 'underline'
    }
})