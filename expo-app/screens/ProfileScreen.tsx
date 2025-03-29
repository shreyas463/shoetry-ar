import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  // Placeholder user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    joined: 'March 2025',
  };

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);
  const toggleLocation = () => setLocationEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userJoined}>Member since {user.joined}</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="card-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="location-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Shipping Addresses</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#ccc", true: "#3B5BA5" }}
              thumbColor="#fff"
              ios_backgroundColor="#ccc"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: "#ccc", true: "#3B5BA5" }}
              thumbColor="#fff"
              ios_backgroundColor="#ccc"
              onValueChange={toggleDarkMode}
              value={darkModeEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="navigate-outline" size={22} color="#555" style={styles.menuIcon} />
              <Text style={styles.menuText}>Location Services</Text>
            </View>
            <Switch
              trackColor={{ false: "#ccc", true: "#3B5BA5" }}
              thumbColor="#fff"
              ios_backgroundColor="#ccc"
              onValueChange={toggleLocation}
              value={locationEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="chatbubble-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={22} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>ShoeTry AR v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B5BA5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  userJoined: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  editButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
});

export default ProfileScreen;