import Nav from './Nav';
import { Flex } from 'antd';

export default function Header() {

    const styles = {
        customHeading: {
            fontSize: '62px',
            fontWeight: '300',
            margin: '0',
        },
        customHeading2: {
            fontFamily: 'Bitter, system-ui',
            fontWeight: '300',
            fontSize: '32px',
            color: 'var(--olive-2)',
            margin: '0',
        },
        headerContainer: {
            width: '100%',
            borderBottom: '1px solid var(--eerie-black)',
     
        }
    }

    return (
        <div style={styles.headerContainer}>
            <Flex align='center' vertical='true' gap='small'>
                <h1 style={styles.customHeading}>
                    ALIGN
                </h1>
                <h3 style={styles.customHeading2}>
                    MANUAL THERAPY
                </h3>
            </Flex>
            <Nav />
        </div>
    )
}