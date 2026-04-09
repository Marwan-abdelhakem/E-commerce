import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: `
# E-Commerce API Documentation

مرحباً بك في توثيق API الخاص بمتجر E-Commerce الإلكتروني.

## المميزات الرئيسية:
- نظام مصادقة كامل (Authentication & Authorization)
- إدارة المنتجات مع Variations (ألوان مختلفة)
- رفع الصور على Cloudinary
- نظام السلة (Cart)
- نظام الطلبات (Orders)
- إدارة التصنيفات (Categories)

## كيفية الاستخدام:

### 1. التسجيل وتسجيل الدخول
- استخدم \`/api/auth/signUp\` لإنشاء حساب جديد
- استخدم \`/api/auth/login\` للحصول على Access Token و Refresh Token
- Access Token صالح لمدة يوم واحد
- Refresh Token صالح لمدة 7 أيام

### 2. المصادقة (Authentication)
- أضف الـ Token في الـ Header كالتالي:
  \`\`\`
  Authorization: Bearer YOUR_ACCESS_TOKEN
  \`\`\`
- استخدم زر "Authorize" في الأعلى لإضافة الـ Token

### 3. الصلاحيات (Authorization)
- بعض الـ Endpoints تتطلب صلاحية Admin
- المستخدم العادي (user) يمكنه: عرض المنتجات، إضافة للسلة، إنشاء طلبات
- الـ Admin يمكنه: إدارة المنتجات، التصنيفات، عرض جميع الطلبات والمستخدمين

### 4. رفع الصور
- استخدم \`multipart/form-data\` عند رفع الصور
- الصور يتم رفعها تلقائياً على Cloudinary
- كل variation يحتاج صورة أساسية (defaultImage) وصور إضافية (variationImgs)

## ملاحظات مهمة:
- جميع الـ IDs هي MongoDB ObjectId (24 حرف hexadecimal)
- التواريخ بصيغة ISO 8601
- الأسعار بالدولار الأمريكي
- الـ Stock يتم حسابه تلقائياً من مجموع stock كل الـ variations

## الدعم الفني:
للمساعدة أو الإبلاغ عن مشاكل، تواصل مع فريق الدعم.
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
      }
    },
    servers: [
      {
        url: 'https://e-commerce-a6cz.onrender.com',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'نظام المصادقة والتسجيل - Authentication & User Management'
      },
      {
        name: 'Product',
        description: 'إدارة المنتجات مع Variations والصور - Product Management with Variations'
      },
      {
        name: 'Category',
        description: 'إدارة التصنيفات - Category Management'
      },
      {
        name: 'Cart',
        description: 'إدارة سلة التسوق - Shopping Cart Management'
      },
      {
        name: 'Order',
        description: 'إدارة الطلبات - Order Management'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'أدخل الـ Access Token الذي حصلت عليه من /api/auth/login'
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            fullName: {
              type: 'string',
              example: 'أحمد محمد'
            },
            userName: {
              type: 'string',
              example: 'ahmed_mohamed'
            },
            age: {
              type: 'number',
              example: 25
            },
            phone: {
              type: 'string',
              example: '01000000000'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ahmed@example.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'iPhone 15 Pro'
            },
            description: {
              type: 'string',
              example: 'أحدث إصدار من iPhone مع معالج A17 Pro'
            },
            price: {
              type: 'number',
              example: 999.99
            },
            stock: {
              type: 'number',
              example: 80,
              description: 'مجموع stock كل الـ variations'
            },
            category: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            variations: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProductVariation'
              }
            },
            featured: {
              type: 'boolean',
              example: false
            },
            visible: {
              type: 'boolean',
              example: true
            },
            isDeleted: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ProductVariation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            colorName: {
              type: 'string',
              example: 'أسود'
            },
            colorValue: {
              type: 'string',
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              example: '#000000',
              description: 'Hexa color code'
            },
            defaultImage: {
              type: 'string',
              example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
            },
            variationImgs: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['https://res.cloudinary.com/demo/image/upload/sample1.jpg']
            },
            isDefault: {
              type: 'boolean',
              example: true
            },
            stock: {
              type: 'number',
              example: 50
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'Electronics'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            quantity: {
              type: 'number',
              example: 2
            },
            variationId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem'
              }
            },
            totalPrice: {
              type: 'number',
              example: 1999.98
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'pending'
            },
            paymentStatus: {
              type: 'string',
              enum: ['paid', 'unpaid'],
              example: 'unpaid'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            quantity: {
              type: 'number',
              example: 2
            },
            variationId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Validation Error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email format'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'غير مصرح - Token مطلوب أو غير صالح',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Unauthorized - Invalid or missing token'
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'ممنوع - ليس لديك الصلاحية الكافية',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Forbidden - Admin access required'
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'غير موجود - المورد المطلوب غير موجود',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Resource not found'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'خطأ في التحقق من البيانات',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/Modules/**/*.controller.js', './src/Modules/**/*.validation.js'],
};

export default swaggerJsdoc(options);
