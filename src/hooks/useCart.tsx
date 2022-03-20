import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // busca dados do local storage
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    // não nulo -> retorna carrinho
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    // nulo -> retornar vazio
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // pega dados do carrinho e mantém imutabilidade
      const updatedCart = [...cart];

      // o id do produto está contido no carrinho?
      const productExists = updatedCart.find(
        (product) => product.id === productId
      );

      // pega quantidade do produto através da api
      const stock = await api.get(`/stock/${productId}`);

      // guarda a quantidade em estoque
      const stockAmount = stock.data.amount;

      // pega quantidade caso produto exista
      const currentAmount = productExists ? productExists.amount : 0;

      // quantidade desejada = atual + 1
      const amount = currentAmount + 1;

      // verificação de estoque
      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      // se produto existe no carrinho
      if (productExists) {
        // incrementa quantidade
        productExists.amount = amount;
      }

      //se produto não existe no carrinho
      else {
        // procura produto na api
        const product = await api.get(`/products/${productId}`);

        // pega dados do produto + quantidade
        const newProduct = {
          ...product.data,
          amount: 1,
        };

        // atualiza carrinho
        updatedCart.push(newProduct);
      }

      //atualiza state do carrinho
      setCart(updatedCart);

      // local storage deve receber string
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO;
    } catch {
      // TODO;
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO;
    } catch {
      // TODO;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
