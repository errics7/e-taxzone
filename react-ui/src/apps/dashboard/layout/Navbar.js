import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  ArrowDropDown, 
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  SwapHoriz as SwapIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import AccountPopover from './AccountPopover';
import { getAuthHeaders, HOST } from '../../../utils/host.config';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import LogoPolinema from "../../../assets/logopolinema.png";

import {
  fetchTaxpayerData,
  switchSptType,
  updateSptFromAccount,
  selectCurrentSptType,
  selectAvailableSptTypes,
  selectTaxpayerData,
  selectSptLoading,
  selectCurrentSptLabel,
  selectHasMultipleSptTypes
} from '../../../redux/sptSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useHistory();
  
  // Redux selectors
  const currentSptType = useSelector(selectCurrentSptType);
  const availableSptTypes = useSelector(selectAvailableSptTypes);
  const taxpayerData = useSelector(selectTaxpayerData);
  const sptLoading = useSelector(selectSptLoading);
  const currentSptLabel = useSelector(selectCurrentSptLabel);
  const hasMultipleSptTypes = useSelector(selectHasMultipleSptTypes);

  // Local state for UI
  const [portalAnchor, setPortalAnchor] = useState(null);
  const [sptTypeAnchor, setSptTypeAnchor] = useState(null);
  const [accountSwitchAnchor, setAccountSwitchAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch available accounts for switching
  const fetchAvailableAccounts = async () => {
    try {
      const response = await fetch(`${HOST}/api/v2/taxpayer/accounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const result = await response.json();
      if (result.success && result.data) {
        setAvailableAccounts(result.data);
        // Set current account from the active one
        const activeAccount = result.data.find(acc => acc.is_active);
        if (activeAccount) {
          setCurrentAccount(activeAccount);
          // Update SPT type based on account type
          dispatch(updateSptFromAccount(activeAccount));
        }
      }
    } catch (error) {
      console.error('Error fetching available accounts:', error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    dispatch(fetchTaxpayerData());
    fetchAvailableAccounts();
  }, [dispatch]);

  const handlePortalClick = (event) => {
    setPortalAnchor(event.currentTarget);
  };

  const handlePortalClose = () => {
    setPortalAnchor(null);
  };

  const handleAccountSwitchClick = (event) => {
    setAccountSwitchAnchor(event.currentTarget);
  };

  const handleAccountSwitchClose = () => {
    setAccountSwitchAnchor(null);
  };

  // Handle account switching
  const handleAccountSwitch = async (accountId) => {
    try {
      const response = await fetch(`${HOST}/api/v2/taxpayer/switch-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ account_id: accountId })
      });

      const result = await response.json();
      if (result.success) {
        // Update token if provided
        if (result.token) {
          localStorage.setItem('xtoken', result.token);
        }
        
        // Update current account and SPT type
        const newAccount = availableAccounts.find(acc => acc.id === accountId);
        if (newAccount) {
          setCurrentAccount(newAccount);
          dispatch(updateSptFromAccount(newAccount));
        }
        
        // Refresh page to reload with new account context
        window.location.reload();
      } else {
        console.error('Failed to switch account:', result.message);
      }
    } catch (error) {
      console.error('Error switching account:', error);
    }
    
    setAccountSwitchAnchor(null);
  };

  // Handle menu item clicks with redirects
  const handleMenuItemClick = (item) => {
    setPortalAnchor(null);
    
    if (item === 'Dokumen Saya') {
      window.location.href = '/home/setting';
    } else if (item === 'Permintaan Kode Otorisasi Sertifikat Elektronik') {
      window.location.href = '/home/kode-otorisasi';
    }
  };

  // Handle SPT type change using Redux
  const handleSptTypeChange = async (newType) => {
    try {
      await dispatch(switchSptType(newType)).unwrap();
      setSptTypeAnchor(null);
      // FIX: route ke komponen yang sesuai portal aktif
      // company   → /home/spt-tahunan-badan-list (ListSptTahunanBadan)
      // individual → /home/spt-tahunan            (ListSptTahunanOrangPribadi)
      router.push(newType === 'company' ? '/home/spt-tahunan-badan-list' : '/home/spt-tahunan');
    } catch (error) {
      console.error('Failed to switch SPT type:', error);
      // You can add toast notification here
    }
  };

  const portalMenuItems = [
    'Dokumen Saya',
    'Permintaan Kode Otorisasi Sertifikat Elektronik'
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#2E3B5C',
        boxShadow: 'none',
        borderBottom: '1px solid #4A5568'
      }}
    >
      <Toolbar sx={{ minHeight: '48px !important', px: 2 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img 
            src={LogoPolinema}
            alt="Polinema Logo"
            style={{ width: 32, marginRight: 8 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#FFA500', 
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            E-Taxzone
          </Typography>
        </Box>

        {/* User Info */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          
          {/* Account Switcher */}
          {availableAccounts.length > 1 && (
            <Button
              onClick={handleAccountSwitchClick}
              endIcon={<ArrowDropDown />}
              startIcon={<SwapIcon />}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '0.8rem',
                mr: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                borderRadius: 2,
                px: 2
              }}
            >
              Switch Account
            </Button>
          )}

          <Menu
            anchorEl={accountSwitchAnchor}
            open={Boolean(accountSwitchAnchor)}
            onClose={handleAccountSwitchClose}
            PaperProps={{
              sx: { 
                width: 300,
                maxHeight: 400
              }
            }}
          >
            <Box sx={{ p: 2, bgcolor: '#F8F9FA' }}>
              <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                Pilih Akun:
              </Typography>
            </Box>
            
            <Divider />
            
            {availableAccounts.map((account, index) => (
              <MenuItem 
                key={index}
                onClick={() => handleAccountSwitch(account.id)}
                sx={{ 
                  py: 2,
                  px: 2,
                  '&:hover': { bgcolor: '#F3F4F6' },
                  bgcolor: currentAccount?.id === account.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: account.taxpayer_type === 'company' ? '#10B981' : '#3B82F6' 
                  }}>
                    {account.taxpayer_type === 'company' ? <BusinessIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {account.name || account.company_name}
                      </Typography>
                      {currentAccount?.id === account.id && (
                        <CheckIcon sx={{ color: '#10B981', fontSize: 16 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {account.taxpayer_type === 'company' ? 'Akun Badan' : 'Akun Pribadi'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                        NPWP: {account.npwp || 'Tidak tersedia'}
                      </Typography>
                    </Box>
                  }
                />
              </MenuItem>
            ))}
            
            <Divider />
            
            <MenuItem 
              onClick={() => {
                setAccountSwitchAnchor(null);
                router.push('/manage-accounts');
              }}
              sx={{ py: 1.5, px: 2, color: '#3B82F6' }}
            >
              <ListItemIcon>
                <BusinessIcon sx={{ color: '#3B82F6' }} />
              </ListItemIcon>
              <ListItemText primary="Kelola Akun" />
            </MenuItem>
          </Menu>

          {/* SPT Type Selector */}
          {!isMobile && hasMultipleSptTypes && (
            <Box sx={{ position: 'relative', mr: 2 }}>
              <Button
                onClick={(e) => setSptTypeAnchor(e.currentTarget)}
                endIcon={<ArrowDropDown />}
                startIcon={
                  currentSptType === 'company' ? (
                    <BusinessIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <PersonIcon sx={{ fontSize: 16 }} />
                  )
                }
                disabled={sptLoading}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  bgcolor: 'rgba(255,165,0,0.15)',
                  border: '1px solid rgba(255,165,0,0.3)',
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  minWidth: 160,
                  justifyContent: 'space-between',
                  '&:hover': { 
                    bgcolor: 'rgba(255,165,0,0.25)',
                    borderColor: 'rgba(255,165,0,0.5)'
                  },
                  '&:disabled': {
                    opacity: 0.6
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {sptLoading ? 'Loading...' : currentSptLabel}
              </Button>

              <Menu
                anchorEl={sptTypeAnchor}
                open={Boolean(sptTypeAnchor)}
                onClose={() => setSptTypeAnchor(null)}
                PaperProps={{
                  sx: { 
                    width: 280,
                    mt: 1,
                    border: '1px solid rgba(255,165,0,0.2)',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                  }
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              >
                <Box sx={{ p: 1.5, bgcolor: '#F8F9FA', borderRadius: '8px 8px 0 0' }}>
                  <Typography variant="subtitle2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    Pilih Jenis SPT
                  </Typography>
                </Box>
                
                <Divider />
                
                {availableSptTypes.map((type) => (
                  <MenuItem 
                    key={type.value}
                    onClick={() => handleSptTypeChange(type.value)}
                    disabled={sptLoading}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      mx: 1,
                      my: 0.5,
                      borderRadius: 1,
                      bgcolor: currentSptType === type.value ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                      border: currentSptType === type.value ? '1px solid rgba(255, 165, 0, 0.3)' : '1px solid transparent',
                      '&:hover': { 
                        bgcolor: currentSptType === type.value ? 'rgba(255, 165, 0, 0.15)' : '#F3F4F6' 
                      },
                      '&:disabled': {
                        opacity: 0.6
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: type.value === 'company' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          mr: 2
                        }}
                      >
                        {type.value === 'company' ? (
                          <BusinessIcon sx={{ fontSize: 18, color: '#10B981' }} />
                        ) : (
                          <PersonIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>
                          {type.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {type.description}
                        </Typography>
                      </Box>
                      {currentSptType === type.value && (
                        <CheckIcon sx={{ color: '#FFA500', fontSize: 18 }} />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <AccountPopover />
        </Box>
      </Toolbar>

      {/* Second Navigation Bar */}
      <Box sx={{ bgcolor: '#1E293B', borderTop: '1px solid #4A5568' }}>
        <Toolbar sx={{ minHeight: '48px !important', px: 2 }}>
          {/* Portal Saya Dropdown */}
          <Button
            onClick={handlePortalClick}
            endIcon={<ArrowDropDown />}
            sx={{ 
              color: 'white',
              textTransform: 'none',
              bgcolor: '#FFA500',
              '&:hover': { bgcolor: '#FF8C00' },
              mr: 2
            }}
          >
            Portal Saya
          </Button>

          <Menu
            anchorEl={portalAnchor}
            open={Boolean(portalAnchor)}
            onClose={handlePortalClose}
            PaperProps={{
              sx: { 
                width: 320,
                maxHeight: 400
              }
            }}
          >
            {portalMenuItems.map((item, index) => (
              <MenuItem 
                key={index} 
                onClick={() => handleMenuItemClick(item)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: '#F3F4F6' }
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Menu>

          {/* SPT Button - Simple navigation without dropdown */}
          {!isMobile && (
            <Button
              onClick={() => router.push(currentSptType === 'company' ? '/home/spt-tahunan-badan-list' : '/home/spt-tahunan')}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '0.85rem',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Surat Pemberitahuan (SPT)
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ color: 'white', ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <Box sx={{ bgcolor: '#374151', p: 2 }}>
            {/* Account Switcher for Mobile */}
            {availableAccounts.length > 1 && (
              <Button
                fullWidth
                onClick={(e) => handleAccountSwitchClick(e)}
                startIcon={<SwapIcon />}
                sx={{
                  color: 'white',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  mb: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Switch Account
              </Button>
            )}

            {/* SPT Type Selector for Mobile */}
            {hasMultipleSptTypes && (
              <Button
                fullWidth
                onClick={(e) => setSptTypeAnchor(e.currentTarget)}
                startIcon={
                  currentSptType === 'company' ? (
                    <BusinessIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <PersonIcon sx={{ fontSize: 16 }} />
                  )
                }
                endIcon={<ArrowDropDown />}
                disabled={sptLoading}
                sx={{
                  color: 'white',
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  mb: 1,
                  bgcolor: 'rgba(255,165,0,0.15)',
                  border: '1px solid rgba(255,165,0,0.3)',
                  borderRadius: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,165,0,0.25)',
                    borderColor: 'rgba(255,165,0,0.5)'
                  },
                  '&:disabled': {
                    opacity: 0.6
                  }
                }}
              >
                {sptLoading ? 'Loading...' : currentSptLabel}
              </Button>
            )}
            
            <Button
              fullWidth
              onClick={() => router.push(currentSptType === 'company' ? '/home/spt-tahunan-badan-list' : '/home/spt-tahunan')}
              sx={{
                color: 'white',
                justifyContent: 'flex-start',
                textTransform: 'none',
                mb: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Surat Pemberitahuan (SPT)
            </Button>
          </Box>
        )}
      </Box>
    </AppBar>
  );
};

export default Navbar;