import React, { useState, useEffect } from 'react';
import { Container, Grid, AppBar, Toolbar, Typography, Box, Button, CircularProgress } from '@mui/material';
import CampaignsList from './components/CampaignsList';
import InsightsChart from './components/InsightsChart';
import logo from './image/logo_parse.png';
import { getApplication } from "./api/applicationService";

interface AppProps {
    eventCaller: string;
}

// Declaração global para o Facebook SDK
declare global {
    interface Window {
        FB: any;
    }
}

const App: React.FC<AppProps> = ({ eventCaller }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [pageAccessToken, setPageAccessToken] = useState<string | null>(null); // Corrigido para null
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const application = await getApplication();
            console.log(application);
        };

        fetchData();

        // Load the Facebook SDK asynchronously
        (function(d: Document, s: string, id: string) {
            var js: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;
            var fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            if (fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs);
            }
            js.onload = () => {
                if (window.FB) {
                    window.FB.init({
                        appId: '1154848712403630', // Replace with your Facebook App ID
                        cookie: true,
                        xfbml: true,
                        version: 'v20.0'
                    });
                    window.FB.AppEvents.logPageView();
                }
            };
        }(document, 'script', 'facebook-jssdk'));

        // Extract access token from URL hash
        const extractTokenFromUrl = () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get('access_token');
            if (token) {
                setPageAccessToken(token);
                console.log('Access Token:', token);
            }
            setLoading(false); // Set loading to false once the token extraction is done
        };

        extractTokenFromUrl();
    }, []);

    const handleCampaignSelect = (campaignId: string) => {
        setSelectedCampaignId(campaignId);
    };

    const handleLogin = () => {
        const authUrl = 'https://www.facebook.com/v20.0/dialog/oauth?' +
                        'response_type=token&' +
                        'display=popup&' +
                        'client_id=1154848712403630&' +
                        'redirect_uri=https://parse-insights-509f01aeb090.herokuapp.com/&' +
                        'auth_type=rerequest&' +
                        'scope=read_insights,catalog_management,ads_management,ads_read,business_management';

        window.open(authUrl, '_blank'); // Abre a URL no mesmo tab
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        {eventCaller !== 'blip-ai' ? (
                            <img src={logo} alt="Logo" style={{ height: 30 }} />
                        ) : (
                            <img src="https://lais.ai/images/lais-white.svg" alt="Logo" style={{ height: 25 }} />
                        )}
                    </Box>
                    <Typography variant="h6" component="div">
                        Insights
                    </Typography>
                    <Button color="inherit" onClick={handleLogin}>
                        Login com Facebook
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 1, ml: 0 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    pageAccessToken ? (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <CampaignsList onSelect={handleCampaignSelect} pageAccessToken={pageAccessToken} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                {selectedCampaignId && <InsightsChart campaignId={selectedCampaignId} pageAccessToken={pageAccessToken} />}
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography variant="h6" component="div">
                            Por favor, faça login para acessar os dados.
                        </Typography>
                    )
                )}
            </Container>
        </>
    );
};

export default App;
