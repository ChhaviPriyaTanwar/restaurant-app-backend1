// utils/constants.js

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

const MESSAGE = {
    //General
    SUCCESS: 'Success',
    DATA_CREATED: 'Data created successfully',
    BAD_REQUEST: 'Invalid request data',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'An error occurred on the server',
    
    //Common
    REQUIRED_FIELDS: 'Required fields cannot be empty.',
    EMAIL_EXISTS: 'Email already exists.',
    PASSWORD_NOT_MATCH: 'Password do not match.',
    INVALID_ROLE: 'Invalid role',
    INCORRECT_PASSWORD: 'Incorrect Password',



    //Token
    TOKEN_REQUIRED: 'Token is required',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    FAILED_TO_AUTHENTICATE: 'Failed to authenticate token',

    //Signup and User Profile
    USER_SIGNUP_SUCCESS: 'User signup successfully',
    USER_SIGNUP_FAILED: 'User signup failed',
    USER_NOT_FOUND: 'User not found ',

    //Login
    LOGIN_SUCCESS: 'Login successfully',
    LOGIN_FAILED: 'Login failed. Invalid credentials',
    
    //User Profile
    USERS_FETCHED_SUCCESS: "Users fetched successfully",
    USERS_FETCHED_FAILED: "Failed to fetch users",
    NO_DATA_FOUND: "No data found",
    USER_FETCHED_SUCCESS: "User fetched successfully",
    USER_FETCHED_FAILED: "Failed to fetch users",
    EMAIL_REQUIRED: 'Email required',
    ID_REQUIRED: 'ID required',
    USER_UPDATED_SUCCESS: "User profile updated successfully.",
    USER_UPDATED_FAILED: "Failed to update user profile.",
    USER_DELETED_SUCCESS: "User profile deleted successfully.",
    USER_DELETED_FAILED: "Failed to delete user profile.",
    
    //Role
    ROLE_EXISTS: 'Role already exists',
    ROLE_ADDED: 'Role added successfully',
    PERMISSION_EXISTS: 'Permission already exists',
    PERMISSION_ADDED: 'Permission added successfully',
    ROLE_PERMISSION_ASSIGNED: 'Role permission assigned successfully',
    ROLE_NOT_FOUND: 'Role not found',
    PERMISSION_NOT_FOUND: 'Permission not found',
    INSUFFICIENT_PERMISSIONS: 'Access Denied: Insufficient Permissions',
    SERVER_ERROR: 'Server Error',
    NO_ROLE_FOUND: 'No role found for the user',
    INVALID_HTTP_METHOD: 'Invalid permission method',
    
    //Reset Password 
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    PASSWORD_RESET_FAILED: 'Password reset failed',
    RESET_LINK_SENT: 'Password reset link sent.',
    RESET_FAILED: 'Password reset failed.',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully.',
    INVALID_RESET_TOKEN: 'Invalid or expired reset token.',
    
    //OTP
    OTP_VERIFIED: 'OTP verified successfully',
    OTP_INVALID: 'Invalid OTP',
    OTP_SENT_SUCCESS: 'OTP has been sent successfully.',
    OTP_VERIFIED_SUCCESS: 'OTP verified successfully.',
    INVALID_OTP: 'Invalid OTP.',
    EXPIRED_OTP: 'OTP has expired.',
    OTP_REQUEST_FAILED: 'Failed to request OTP.',
    OTP_VERIFICATION_FAILED: 'Failed to verify OTP.',

    //Menu
    MENU_ITEM_CREATED: 'Menu item created successfully.',
    MENU_ITEMS_FETCHED: 'Menu items fetched successfully.',
    MENU_ITEM_FETCHED: 'Menu item fetched successfully.',
    MENU_ITEM_UPDATED: 'Menu item updated successfully.',
    MENU_ITEM_DELETED: 'Menu item deleted successfully.',
    MENU_ITEM_NOT_FOUND: 'Menu item not found.',
    MENU_ITEM_CREATION_FAILED: 'Failed to create menu item.',
    MENU_ITEMS_FETCH_FAILED: 'Failed to fetch menu items.',
    MENU_ITEM_FETCH_FAILED: 'Failed to fetch menu item.',
    MENU_ITEM_UPDATE_FAILED: 'Failed to update menu item.',
    MENU_ITEM_DELETE_FAILED: 'Failed to delete menu item.',
    MENU_RETRIEVED: "Menu items retrieved successfully",
    MENU_FETCH_FAILED: "Failed to retrieve menu items",
    MENU_NAME_EXISTS: 'Menu name already exists',


    //Category
    CATEGORY_CREATED: 'Category created successfully.',
    CATEGORY_RETRIEVED: 'Category retrieved successfully.',
    CATEGORY_UPDATED: 'Category updated successfully.',
    CATEGORY_DELETED: 'Category deleted successfully.',
    CATEGORIES_RETRIEVED: 'Categories retrieved successfully.',
    CATEGORY_NOT_FOUND: 'Category not found.',
    CATEGORY_CREATION_FAILED: 'Failed to create category.',
    CATEGORY_UPDATE_FAILED: 'Failed to update category.',
    CATEGORY_DELETE_FAILED: 'Failed to delete category.',
    CATEGORIES_FETCH_FAILED: 'Failed to fetch categories.',
    CATEGORY_NAME_EXISTS: 'Category name already exists',

    //Cart
    CART_ITEM_ADDED: "Item added to cart successfully.",
    CART_ITEM_ADD_FAILED: "Failed to add item to cart.",
    CART_ITEMS_RETRIEVED: "Cart items retrieved successfully.",
    CART_ITEMS_RETRIEVE_FAILED: "Failed to retrieve cart items.",
    CART_ITEM_UPDATED: "Cart item updated successfully.",
    CART_ITEM_UPDATE_FAILED: "Failed to update cart item.",
    CART_ITEM_REMOVED: "Cart item removed successfully.",
    CART_ITEM_REMOVE_FAILED: "Failed to remove cart item.",
    MENU_ITEM_NOT_FOUND: "Menu item not found.",
    CART_ITEM_NOT_FOUND: "Cart item not found.",
    INVALID_QUANTITY: "Invalid Quantity.",

    //Order
    ORDER_CREATED: "Order created successfully.",
    ORDERS_RETRIEVED: "Orders retrieved successfully.",
    ORDER_UPDATED: "Order updated successfully.",
    ORDER_REMOVED: "Order removed successfully.",
    ORDER_NOT_FOUND: "Order not found.",
    ORDER_CREATION_FAILED: "Failed to create order.",
    ORDER_RETRIEVAL_FAILED: "Failed to retrieve orders.",
    ORDER_UPDATE_FAILED: "Failed to update order.",
    ORDER_REMOVAL_FAILED: "Failed to remove order.",
    MENU_ITEM_NOT_FOUND: "Menu item not found.",

    //Bill
    BILL_CREATED: "Bill created successfully.",
    BILL_CREATION_FAILED: "Failed to create bill.",
    BILLS_RETRIEVED: "Bills retrieved successfully.",
    BILL_RETRIEVAL_FAILED: "Failed to retrieve bills.",
    BILL_NOT_FOUND: "Bill not found.",
    BILL_UPDATED: "Bill updated successfully.",
    BILL_UPDATE_FAILED: "Failed to update bill.",
    BILL_DELETED: "Bill deleted successfully.",
    BILL_DELETION_FAILED: "Failed to delete bill.",

    //Feedback
    FEEDBACK_CREATED: "Feedback created successfully.",
    FEEDBACK_CREATION_FAILED: "Failed to create feedback.",
    FEEDBACKS_RETRIEVED: "Feedbacks retrieved successfully.",
    FEEDBACK_RETRIEVED: "Feedback retrieved successfully.",
    FEEDBACK_NOT_FOUND: "Feedback not found.",
    FEEDBACK_UPDATED: "Feedback updated successfully.",
    FEEDBACK_UPDATE_FAILED: "Failed to update feedback.",
    FEEDBACK_DELETED: "Feedback deleted successfully.",
    FEEDBACK_DELETION_FAILED: "Failed to delete feedback.",
    FEEDBACKS_RETRIEVAL_FAILED: "Failed to retrieve feedbacks.",

    //Favorite
    FAVORITE_ADDED: 'Favorite added successfully.',
    FAVORITE_ADD_FAILED: 'Failed to add favorite.',
    FAVORITES_RETRIEVED: 'Favorites retrieved successfully.',
    FAVORITES_RETRIEVE_FAILED: 'Failed to retrieve favorites.',
    FAVORITE_UPDATED: 'Favorite updated successfully.',
    FAVORITE_UPDATED_FAILED: 'Failed to updated favorite.',
    FAVORITE_DELETED: 'Favorite deleted successfully.',
    FAVORITE_DELETION_FAILED: 'Failed to delete favorite.',
    FAVORITE_NOT_FOUND: 'Favorite not found.',
    FAVORITES_CLEARED: 'All favorites cleared successfully.',
    FAVORITES_CLEAR_FAILED: 'Failed to clear favorites.',
    FAVORITE_ALREADY_EXISTS: 'This item is already in your favorites.',
    INVALID_IDS: 'Invalid id.',

    //Staff
    STAFF_CREATED: "Staff member created successfully.",
    STAFF_CREATION_FAILED: "Failed to create staff member.",
    STAFF_RETRIEVED: "Staff member(s) retrieved successfully.",
    STAFF_RETRIEVAL_FAILED: "Failed to retrieve staff member(s).",
    STAFF_NOT_FOUND: "Staff member not found.",
    STAFF_UPDATED: "Staff member updated successfully.",
    STAFF_UPDATE_FAILED: "Failed to update staff member.",
    STAFF_DELETED: "Staff member deleted successfully.",
    STAFF_DELETION_FAILED: "Failed to delete staff member.",
    STAFF_EMAIL_NOT_FOUND: "Staff email not found.",

    // Validation Messages
    VALIDATION: {
        NAME: 'Name is required and must be at least 2 characters long and contain only letters and spaces.',
        EMAIL: 'Email is not valid.',
        PHONE: 'Phone must be exactly 10 digits long.',
        PASSWORD: 'Password must be at least 6 characters long and contain letters and numbers.',
        DESCRIPTION: 'Invalid description format.',

    },
};

module.exports = {
    STATUS_CODE,
    MESSAGE,
};
