import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, IconButton, Typography } from '@mui/material';
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './style.module.scss';
import { FilterTypes } from '@constants/index';
import ProductList from '@components/common/ProductList';




interface ChooseProductProps {
    onItemSelected?: (value: string) => void;
    onBack?: () => void;
}



const ChooseProduct = ({ onItemSelected, onBack }: ChooseProductProps) => {
    const [checked, setChecked] = React.useState([false, false])
    const [filters, setFilters] = React.useState<{ filter: FilterTypes, value: string }[]>([])
    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, event.target.checked]);
    }

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([event.target.checked, checked[1]]);
    }

    const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked([checked[0], event.target.checked]);
    }

    const renderMenu = (title: string, childrenItems?: string[]) => {
        const children = (
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>

                {childrenItems?.map((childItem) => (
                    <FormControlLabel
                        key={childItem}
                        label={childItem}
                        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                    />
                ))}

            </Box>
        )



        return (
            <Box>

                <FormControlLabel
                    label={title}
                    control={
                        <Checkbox
                            checked={checked[0] && checked[1]}
                            indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange1}
                        />
                    }
                />
                {children}
            </Box>
        );

    }


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
            [FilterTypes.Electronics]: 'Elektronik'
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
                        <MenuItem value="">Tümü</MenuItem>
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
            electronics: "Standard1"
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
            electronics: "Standard2"
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
            electronics: "Standard1"
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
            electronics: "Standard3"
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
            electronics: "Standard2"
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
            electronics: "Standard3"
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
            electronics: "Standard2"
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
            electronics: "Standard1"
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
        });
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
                    Filtreler
                    {filters.length > 0 && (
                        <Box component="span" className={styles.chooseProduct__filterCount}>
                            ({filteredProducts.length} ürün)
                        </Box>
                    )}
                </Box>
                <Box className={styles.chooseProduct__filters}>
                    {renderSelectMenu(FilterTypes.Sensors, ['Sensor1', 'Sensor2', 'Sensor3'])}
                    {renderSelectMenu(FilterTypes.ConnectionType, ['Type1', 'Type2', 'Type3'])}
                    {renderSelectMenu(FilterTypes.Properties, ['Property1', 'Property2', 'Property3'])}
                    {renderSelectMenu(FilterTypes.Electronics, ['Standard1', 'Standard2', 'Standard3'])}
                </Box>
            </Box>

            <ProductList products={filteredProducts} />
        </Box>
    )
}


export default ChooseProduct 
