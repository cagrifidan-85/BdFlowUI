import { Box, Select, IconButton, Typography, Link, FormControl, MenuItem } from '@mui/material';
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './style.module.scss';
import { EnvironmentType, FilterTypes, MaterialType, ProductType } from '@constants/index';
import ProductList from '@components/common/ProductList';
import { useTranslation } from 'react-i18next';




interface ChooseProductProps {
    onItemSelected?: (value: string) => void;
    onBack?: () => void;
    material?: MaterialType;
    environment?: EnvironmentType;
}



const ChooseProduct = ({ onItemSelected, onBack, material, environment }: ChooseProductProps) => {
    const { t } = useTranslation();
    const [filters, setFilters] = React.useState<{ filter: FilterTypes, value: string }[]>([])

    const handleChange = (filterType: FilterTypes, value: string) => {
        setFilters(prevFilters => {
            const filtered = prevFilters.filter(f => f.filter !== filterType);
            return [...filtered, { filter: filterType, value }];
        });
    }


    const renderSelectMenu = (filterType: FilterTypes, items: string[]) => {
        const currentFilter = filters.find(f => f.filter === filterType);
        const filterLabels: Record<FilterTypes, string> = {
            [FilterTypes.Sensors]: 'Sensör Tipi',
            [FilterTypes.ConnectionType]: 'Bağlantı Tipi',
            [FilterTypes.Properties]: 'Özellikler',
            [FilterTypes.Others]: 'Diğer',
            [FilterTypes.Electronics]: 'Elektronik',


        };

        return (
            <Box className={styles.chooseProduct__filterCard}>
                <Typography className={styles.chooseProduct__filterLabel}>
                    {filterLabels[filterType]}
                </Typography>
                <FormControl size="small" className={styles.chooseProduct__filterSelect}>
                    <Select
                        value={currentFilter?.value || ''}
                        onChange={(event) => handleChange(filterType, event.target.value as string)}
                        displayEmpty
                        className={styles.chooseProduct__select}
                    >
                        <MenuItem value="">{t('all')}</MenuItem>
                        {items.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
        )
    }

    const allProducts = [
        {
            name: "Basınç Sensörü A",
            type: "Basınç Sensörü",
            image: "/images/1.png",
            measurementRange: "-1 ... 60 bar",
            description: "Kompakt, genel amaçlı basınç sensörü.",
            price: 1200,
            sensor: "Sensor1",
            connectionType: "Type1",
            properties: "Property1",
            electronics: "Standard1",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Level",
            environment: "Gas"
        },
        {
            name: "Seviye Sensörü B",
            type: "Seviye Sensörü",
            image: "/images/2.png",
            measurementRange: "0 ... 15 m",
            description: "Sıvı ve katıların temassız seviye ölçümü için radar sensörü.",
            price: 2500,
            sensor: "Sensor2",
            connectionType: "Type2",
            properties: "Property2",
            electronics: "Standard2",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Limit",
            environment: "Liquid"
        },
        {
            name: "Seviye Anahtarı C",
            type: "Seviye Anahtarı",
            image: "/images/3.png",
            measurementRange: "Limit seviye",
            description: "Sıvı ve katıların limit seviye tespiti için kapasitif anahtar.",
            price: 900,
            sensor: "Sensor1",
            connectionType: "Type3",
            properties: "Property3",
            electronics: "Standard1",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Pressure",
            environment: "Gas"
        },
        {
            name: "Mikrodalga Sensör D",
            type: "Mikrodalga Seviye Sensörü",
            image: "/images/4.png",
            measurementRange: "0 ... 75 m",
            description: "Sıvı ve dökme katıların sürekli seviye ölçümü için.",
            price: 3200,
            sensor: "Sensor3",
            connectionType: "Type1",
            properties: "Property1",
            electronics: "Standard3",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Intensity",
            environment: "Liquid"
        },
        {
            name: "Radar Sensör E",
            type: "Radar Seviye Sensörü",
            image: "/images/5.png",
            measurementRange: "0 ... 75 m",
            description: "Sıvı ve katıların hassas seviye ölçümü için kılavuzlu radar sensörü.",
            price: 4100,
            sensor: "Sensor2",
            connectionType: "Type2",
            properties: "Property2",
            electronics: "Standard2",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "MassFlow",
            environment: "Gas"
        },
        {
            name: "Basınç Sensörü F",
            type: "Basınç Sensörü",
            image: "/images/1.png",
            measurementRange: "0 ... 100 bar",
            description: "Yüksek basınç ölçümleri için endüstriyel sensör.",
            price: 1800,
            sensor: "Sensor1",
            connectionType: "Type2",
            properties: "Property3",
            electronics: "Standard3",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "SeparatorLayer",
            environment: "Liquid"
        },
        {
            name: "Akıllı Seviye Sensörü G",
            type: "Seviye Sensörü",
            image: "/images/2.png",
            measurementRange: "0 ... 30 m",
            description: "IoT özelliği ile uzaktan izleme imkanı.",
            price: 3500,
            sensor: "Sensor3",
            connectionType: "Type3",
            properties: "Property1",
            electronics: "Standard2",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Level",
            environment: "Liquid"
        },
        {
            name: "Kompakt Sensör H",
            type: "Seviye Anahtarı",
            image: "/images/3.png",
            measurementRange: "Limit seviye",
            description: "Küçük alanlar için kompakt tasarım.",
            price: 750,
            sensor: "Sensor2",
            connectionType: "Type1",
            properties: "Property2",
            electronics: "Standard1",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Limit",
            environment: "Gas"
        },
        {
            name: "Endüstriyel Sensör I",
            type: "Mikrodalga Seviye Sensörü",
            image: "/images/4.png",
            measurementRange: "0 ... 100 m",
            description: "Zorlu endüstriyel ortamlara dayanıklı.",
            price: 4000,
            sensor: "Sensor1",
            connectionType: "Type3",
            properties: "Property3",
            electronics: "Standard3",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Pressure",
            environment: "Liquid",
        },
        {
            name: "Yüksek Performans Sensör J",
            type: "Radar Seviye Sensörü",
            image: "/images/5.png",
            measurementRange: "0 ... 150 m",
            description: "Uzun mesafe seviye ölçümleri için yüksek performanslı sensör.",
            price: 5000,
            sensor: "Sensor2",
            connectionType: "Type2",
            properties: "Property1",
            electronics: "Standard2",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "MassFlow",
            environment: "Gas",
        },
        {
            name: "Akıllı Basınç Sensörü K",
            type: "Basınç Sensörü",
            image: "/images/1.png",
            measurementRange: "0 ... 200 bar",
            description: "Akıllı özelliklerle donatılmış basınç sensörü.",
            price: 2200,
            sensor: "Sensor3",
            connectionType: "Type1",
            properties: "Property2",
            electronics: "Standard1",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "SeparatorLayer",
            environment: "Liquid",

        },
        {
            name: "Seviye Sensörü L",
            type: "Seviye Sensörü",
            image: "/images/2.png",
            measurementRange: "0 ... 20 m",
            description: "Hassas seviye ölçümleri için yüksek doğruluklu sensör.",
            price: 2700,
            sensor: "Sensor1",
            connectionType: "Type2",
            properties: "Property3",
            electronics: "Standard3",
            catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
            material: "Level",
            environment: "Gas",
        }
    ]

    // Filtreleme mantığı
    const filteredProducts = React.useMemo(() => {
        return allProducts.filter(product => {
            const sensorFilter = filters.find(f => f.filter === FilterTypes.Sensors);
            const connectionFilter = filters.find(f => f.filter === FilterTypes.ConnectionType);
            const propertiesFilter = filters.find(f => f.filter === FilterTypes.Properties);
            const electronicsFilter = filters.find(f => f.filter === FilterTypes.Electronics);


            if (sensorFilter && sensorFilter.value && product.sensor !== sensorFilter.value) return false;
            if (connectionFilter && connectionFilter.value && product.connectionType !== connectionFilter.value) return false;
            if (propertiesFilter && propertiesFilter.value && product.properties !== propertiesFilter.value) return false;
            if (electronicsFilter && electronicsFilter.value && product.electronics !== electronicsFilter.value) return false;


            return true;
        }) as ProductType[];
    }, [filters]);
    return (
        <Box className={styles.chooseProduct}>
            {onBack && (
                <Box className={styles.chooseProduct__navigation}>
                    <IconButton
                        onClick={onBack}
                        className={styles.chooseProduct__navigationBtn}
                        size="large"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </Box>
            )}
            <Box className={styles.chooseProduct__filtersContainer}>
                <Box className={styles.chooseProduct__filtersHeader}>
                    <Box>
                        {t('filters')}
                        {filters.length > 0 && (
                            <Box component="span" className={styles.chooseProduct__filterCount}>
                                {' '}
                                ({filters.length} {t('selected')})
                            </Box>
                        )}
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        <Typography fontSize='1rem' fontWeight="bold" >
                            {t('material')} :
                        </Typography>
                        <Typography variant="subtitle1" component="span" fontStyle="italic" >
                            {t(`${material?.toLowerCase()}`)}
                        </Typography>
                    </Box>
                    <Box className={styles.chooseProduct__selectedFilters}>
                        <Typography fontSize='1rem' fontWeight="bold" >
                            {t('environment')} :
                        </Typography>
                        <Typography variant="subtitle1" component="span" fontStyle="italic" >
                            {t(`${environment?.toLowerCase()}`)}
                        </Typography>
                    </Box>
                    <Link variant="body2" component="span" className={styles.chooseProduct__clearFilter} onClick={() => setFilters([])}>
                        {t('clear')}
                    </Link>
                </Box>
                <Box className={styles.chooseProduct__filters}>
                    {renderSelectMenu(FilterTypes.Sensors, ['Sensor1', 'Sensor2', 'Sensor3'])}
                    {renderSelectMenu(FilterTypes.ConnectionType, ['Type1', 'Type2', 'Type3'])}
                    {renderSelectMenu(FilterTypes.Properties, ['Property1', 'Property2', 'Property3'])}
                    {renderSelectMenu(FilterTypes.Electronics, ['Standard1', 'Standard2', 'Standard3'])}
                </Box>
            </Box>

            <ProductList products={filteredProducts.filter(item => item.material === material && item.environment === environment)} />
        </Box>
    )
}


export default ChooseProduct 
