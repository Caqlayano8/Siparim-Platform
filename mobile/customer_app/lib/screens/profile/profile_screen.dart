import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/user.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(title: const Text('Profilim')),
      body: user == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  // Profile header
                  _buildProfileHeader(user),
                  const SizedBox(height: 16),
                  // Menu items
                  _buildMenuSection(context, user, auth),
                ],
              ),
            ),
    );
  }

  Widget _buildProfileHeader(User user) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.primaryColor, AppTheme.orangeColor],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 44,
            backgroundColor: Colors.white,
            child: Text(
              user.name.isNotEmpty ? user.name[0].toUpperCase() : 'K',
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            user.name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            user.email,
            style: const TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            user.phone,
            style: const TextStyle(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(
      BuildContext context, User user, AuthProvider auth) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Addresses
          const _SectionHeader(title: 'Adreslerim'),
          if (user.addresses.isEmpty)
            _emptyAddressCard(context)
          else
            ...user.addresses.map((addr) => _addressCard(addr)),
          _addAddressButton(context),
          const SizedBox(height: 16),

          // Account settings
          const _SectionHeader(title: 'Hesap'),
          _menuItem(
            context,
            icon: Icons.person_outline,
            title: 'Kişisel Bilgiler',
            onTap: () {},
          ),
          _menuItem(
            context,
            icon: Icons.notifications_outlined,
            title: 'Bildirimler',
            onTap: () {},
          ),
          _menuItem(
            context,
            icon: Icons.lock_outline,
            title: 'Şifre Değiştir',
            onTap: () {},
          ),
          const SizedBox(height: 16),

          // Support
          const _SectionHeader(title: 'Destek'),
          _menuItem(
            context,
            icon: Icons.help_outline,
            title: 'Yardım & SSS',
            onTap: () {},
          ),
          _menuItem(
            context,
            icon: Icons.star_outline,
            title: 'Uygulamayı Değerlendir',
            onTap: () {},
          ),
          _menuItem(
            context,
            icon: Icons.info_outline,
            title: 'Hakkında',
            onTap: () {},
          ),
          const SizedBox(height: 16),

          // Logout
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 32),
            child: OutlinedButton.icon(
              onPressed: () => _showLogoutDialog(context, auth),
              icon: const Icon(Icons.logout, color: AppTheme.primaryColor),
              label: const Text(
                'Çıkış Yap',
                style: TextStyle(color: AppTheme.primaryColor),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppTheme.primaryColor),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _emptyAddressCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 4)],
      ),
      child: const Center(
        child: Text(
          'Kayıtlı adres yok',
          style: TextStyle(color: AppTheme.textGrey),
        ),
      ),
    );
  }

  Widget _addressCard(Address addr) {
    return Container(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: addr.isDefault
            ? Border.all(color: AppTheme.primaryColor, width: 1.5)
            : null,
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 4)],
      ),
      child: Row(
        children: [
          Icon(
            addr.title.toLowerCase().contains('ev')
                ? Icons.home_outlined
                : addr.title.toLowerCase().contains('iş')
                    ? Icons.business_outlined
                    : Icons.location_on_outlined,
            color: AppTheme.primaryColor,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      addr.title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    if (addr.isDefault) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Varsayılan',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  addr.fullAddress,
                  style:
                      const TextStyle(color: AppTheme.textGrey, fontSize: 13),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit_outlined,
                size: 18, color: AppTheme.textGrey),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _addAddressButton(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () {},
      icon: const Icon(Icons.add_location_alt_outlined),
      label: const Text('Adres Ekle'),
      style: OutlinedButton.styleFrom(
        foregroundColor: AppTheme.primaryColor,
        side: const BorderSide(color: AppTheme.primaryColor),
        minimumSize: const Size.fromHeight(44),
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Widget _menuItem(BuildContext context,
      {required IconData icon,
      required String title,
      required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 4)],
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.primaryColor),
        title: Text(title,
            style: const TextStyle(color: AppTheme.textDark, fontSize: 14)),
        trailing: const Icon(Icons.chevron_right, color: AppTheme.textGrey),
        onTap: onTap,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, AuthProvider auth) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content: const Text('Hesabınızdan çıkış yapmak istiyor musunuz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await auth.logout();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
            child: const Text('Çıkış Yap'),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: AppTheme.textDark,
        ),
      ),
    );
  }
}
